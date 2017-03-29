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
