namespace DG.Force.Services {
    export interface UserProfileProperties {
        [index: string]: string;
    }

    export class UserProfileService {      
        private static getCurrentUserProfileName(): string {
            return (<any>_spPageContextInfo).userLoginName.indexOf('@') > 0 ? (<any>_spPageContextInfo).systemUserKey : (<any>_spPageContextInfo).userLoginName;
        }

        public static getUserProperties(): JQueryPromise<UserProfileProperties>  {
            var deferred = jQuery.Deferred <UserProfileProperties>();
            var self = this;
            
             $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
                    headers: {
                        Accept: "application/json;odata=verbose"
                    },
                    success: (data) => {
                        var userProps:UserProfileProperties = {};

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
        }

    }
}
