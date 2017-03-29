var DG;
(function (DG) {
    var Force;
    (function (Force) {
        var Services;
        (function (Services) {
            function saveToStorage(value, storageKey, durationinMinutes) {
                if (typeof (window.localStorage) != 'undefined') {
                    var date = new Date();
                    date.setMinutes(date.getMinutes() + durationinMinutes);
                    window.localStorage.setItem(storageKey, JSON.stringify({ expiresAt: date, value: value }));
                }
            }
            Services.saveToStorage = saveToStorage;
            function fetchFromStorage(storageKey) {
                if (typeof (window.localStorage) != 'undefined') {
                    var currentDate = new Date();
                    var raw = window.localStorage.getItem(storageKey);
                    if (raw) {
                        var data = JSON.parse(raw);
                        var expiresAt = data.expiresAt;
                        if (currentDate > new Date(expiresAt)) {
                            window.localStorage.removeItem(storageKey);
                            return null;
                        }
                        return data.value;
                    }
                }
            }
            Services.fetchFromStorage = fetchFromStorage;
        })(Services = Force.Services || (Force.Services = {}));
    })(Force = DG.Force || (DG.Force = {}));
})(DG || (DG = {}));

var DG;
(function (DG) {
    var Force;
    (function (Force) {
        var Services;
        (function (Services) {
            var UserProfileService = (function () {
                function UserProfileService() {
                }
                UserProfileService.getCurrentUserProfileName = function () {
                    return _spPageContextInfo.userLoginName.indexOf('@') > 0 ? _spPageContextInfo.systemUserKey : _spPageContextInfo.userLoginName;
                };
                UserProfileService.getUserProperties = function () {
                    var deferred = jQuery.Deferred();
                    var self = this;
                    $.ajax({
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
                        headers: {
                            Accept: "application/json;odata=verbose"
                        },
                        success: function (data) {
                            var userProps = {};
                            for (var i = 0; i < data.d.UserProfileProperties.results.length; i++) {
                                var property = data.d.UserProfileProperties.results[i];
                                userProps[property.Key.toLowerCase()] = property.Value;
                            }
                            deferred.resolve(userProps);
                        },
                        error: function (jQxhr, errorCode, errorThrown) {
                            deferred.reject({
                                errorCode: errorCode,
                                error: errorThrown
                            });
                        }
                    });
                    return deferred.promise();
                };
                return UserProfileService;
            }());
            Services.UserProfileService = UserProfileService;
        })(Services = Force.Services || (Force.Services = {}));
    })(Force = DG.Force || (DG.Force = {}));
})(DG || (DG = {}));

var DG;
(function (DG) {
    var Force;
    (function (Force) {
        var Services;
        (function (Services) {
            var NewsService = (function () {
                function NewsService() {
                }
                NewsService.retrieveListItems = function (listName, countryName, locationName, divisionName, rowLimit) {
                    var deferred = jQuery.Deferred();
                    var self = this;
                    var context = SP.ClientContext.get_current();
                    var oList = context.get_web().get_lists().getByTitle(listName);
                    var camlQuery = new SP.CamlQuery();
                    var queryTemplate = "<View> \n\t                <RowLimit>" + rowLimit + "</RowLimit>\n                    <Query>\n                        <Where>\n                            <And>\n                                <And>\n                                    <Eq>\n                                        <FieldRef Name='_ModerationStatus' />\n                                        <Value Type='Modstat'>Approved</Value>\n                                    </Eq>\n                                    <Or>\n                                        <Geq>\n                                            <FieldRef Name='Expires' />\n                                            <Value Type='DateTime'><Today /></Value>\n                                        </Geq>\n                                        <IsNull>\n                                            <FieldRef Name='Expires' />\n                                        </IsNull>\n                                    </Or>\n                                </And>\n                                <Or>\n                                    <Or>\n                                        <Eq>\n                                            <FieldRef Name='Location' />\n                                            <Value Type='TaxonomyFieldType'>" + locationName + "</Value>\n                                        </Eq>\n                                        <Or>\n                                            <Eq>\n                                                <FieldRef Name='Country' />\n                                                <Value Type='TaxonomyFieldType'>" + countryName + "</Value>\n                                            </Eq>\n                                            <Eq>\n                                                <FieldRef Name='Division' />\n                                                <Value Type='TaxonomyFieldType'>" + divisionName + "</Value>\n                                            </Eq>\n                                        </Or>\n                                    </Or>\n                                    <And>\n                                        <IsNull>\n                                            <FieldRef Name='Location' />\n                                        </IsNull>\n                                        <And>\n                                            <IsNull>\n                                                <FieldRef Name='Country' />\n                                            </IsNull>\n                                            <IsNull>\n                                                <FieldRef Name='Division' />\n                                            </IsNull>\n                                        </And>\n                                    </And>\n                                </Or>\n                            </And>\n                        </Where>\n                        <OrderBy>\n                            <FieldRef Name='Created' Ascending='Descending' />\n                            <FieldRef Name='Expires' Ascending='Descending' />\n                        </OrderBy>\n                    </Query>\n                </View>";
                    camlQuery.set_viewXml(queryTemplate);
                    var collListItem = oList.getItems(camlQuery);
                    context.load(oList, "DefaultDisplayFormUrl");
                    context.load(collListItem);
                    context.executeQueryAsync(function () {
                        var html = NewsService.onQuerySucceeded(collListItem, oList);
                        deferred.resolve(html);
                    }, function () {
                        deferred.reject(self);
                    });
                    return deferred.promise();
                };
                NewsService.onQuerySucceeded = function (collListItem, oList) {
                    var listItemInfo = '';
                    var listItemEnumerator = collListItem.getEnumerator();
                    var dispFormUrl = oList.get_defaultDisplayFormUrl();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        var url = dispFormUrl + "?ID=" + oListItem.get_id() + "&Source=" + window.location.href;
                        var dateObjCreated = new Date(oListItem.get_item('Created'));
                        var title = "<span class=\"ms-textLarge ms-noWrap\">" + oListItem.get_item('Title') + "</span>";
                        if (oListItem.get_item('Important') === true) {
                            title = "<span class='red'>! </span>" + title;
                        }
                        listItemInfo +=
                            "<div class='force-news-item'>\n                        <div class='force-title'>\n                            <a href='" + url + "'>" + title + "</a><br/>\n                            <div class=\"ms-noWrap ms-comm-postBody\">" + dateObjCreated.format("dd-MM-yyyy") + "</div> \n                        </div>\n                    </div>";
                    }
                    if (listItemInfo == '') {
                        listItemInfo = "<div class='force-no-results'>You have no current news items available</div>";
                    }
                    return listItemInfo;
                };
                return NewsService;
            }());
            Services.NewsService = NewsService;
        })(Services = Force.Services || (Force.Services = {}));
    })(Force = DG.Force || (DG.Force = {}));
})(DG || (DG = {}));

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
