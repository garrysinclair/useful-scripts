/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
/// <reference path="./Services/NewsService.ts"/>
/// <reference path="./Services/StorageService.ts"/>
/// <reference path="./Data/DataService.ts"/>

import UserProfileProperties = DG.Force.Services.UserProfileProperties

namespace DG.Force.Main {
    export function Init(listName:string, countryPropertyName:string, locationPropertyName:string, divisionPropertyName:string, rowLimit:number, durationInMinutes:number){
        $(document).ready(function () { 
            ExecuteOrDelayUntilScriptLoaded(function() {
                ForceNewsMain(listName, countryPropertyName, locationPropertyName, divisionPropertyName, rowLimit, durationInMinutes)
            }, "sp.js"); 
        });
    }

    function ForceNewsMain(listName:string, countryPropertyName:string, locationPropertyName:string, divisionPropertyName:string, rowLimit:number, durationInMinutes:number){
        
        this.cacheKey = ("NewsRollups" + (<any>_spPageContextInfo).userLoginName);
        
        let cache = DG.Force.Services.fetchFromStorage(this.cacheKey);
        
        if(cache){
            console.log("Load from cache");
            $("#forceNewsRollup").html(cache);
        } else {
            console.log("Not cached. Load from SP.");
            DG.Force.Services.UserProfileService.getUserProperties().done((userProps) => {

                var html = DG.Force.Services.NewsService.retrieveListItems(
                    listName, 
                    userProps[countryPropertyName], 
                    userProps[locationPropertyName], 
                    userProps[divisionPropertyName],
                    rowLimit).done((html) => {
                        DG.Force.Services.saveToStorage(html, this.cacheKey, durationInMinutes);
                        $("#forceNewsRollup").html(html);
                    }).fail((error) => {
                        alert(error);
                    });

            }).fail((error) => {
                alert(error);
            });
        }        
    }
}



