/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="./Services/NewsService.ts"/>
/// <reference path="./Services/StorageService.ts"/>
/// <reference path="./Data/DataService.ts"/>
var DG;
(function (DG) {
    var Force;
    (function (Force) {
        var Main;
        (function (Main) {
            function Init(listName, countryPropertyName, locationPropertyName, divisionPropertyName, rowLimit, durationInMinutes) {
                $(document).ready(function () {
                    ExecuteOrDelayUntilScriptLoaded(function () {
                        ForceNewsMain(listName, countryPropertyName, locationPropertyName, divisionPropertyName, rowLimit, durationInMinutes);
                    }, "sp.js");
                });
            }
            Main.Init = Init;
            function ForceNewsMain(listName, countryPropertyName, locationPropertyName, divisionPropertyName, rowLimit, durationInMinutes) {
                var _this = this;
                this.cacheKey = ("NewsRollups" + _spPageContextInfo.userLoginName);
                var cache = DG.Force.Services.fetchFromStorage(this.cacheKey);
                if (cache) {
                    console.log("Load from cache");
                    $("#forceNewsRollup").html(cache);
                }
                else {
                    console.log("Not cached. Load from SP.");
                    DG.Force.Services.UserProfileService.getUserProperties().done(function (userProps) {
                        var html = DG.Force.Services.NewsService.retrieveListItems(listName, userProps[countryPropertyName], userProps[locationPropertyName], userProps[divisionPropertyName], rowLimit).done(function (html) {
                            DG.Force.Services.saveToStorage(html, _this.cacheKey, durationInMinutes);
                            $("#forceNewsRollup").html(html);
                        }).fail(function (error) {
                            alert(error);
                        });
                    }).fail(function (error) {
                        alert(error);
                    });
                }
            }
        })(Main = Force.Main || (Force.Main = {}));
    })(Force = DG.Force || (DG.Force = {}));
})(DG || (DG = {}));
