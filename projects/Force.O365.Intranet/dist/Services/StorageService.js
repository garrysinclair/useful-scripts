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
