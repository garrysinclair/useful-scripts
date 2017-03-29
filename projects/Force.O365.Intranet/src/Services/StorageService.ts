namespace DG.Force.Services {
    export function saveToStorage(value: string, storageKey: string, durationinMinutes:number): void {
        if(typeof (window.localStorage) != 'undefined') {
            var date = new Date();
            date.setMinutes(date.getMinutes() + durationinMinutes);
            window.localStorage.setItem(storageKey, JSON.stringify({expiresAt: date, value: value} ));
        }
    }

    export function fetchFromStorage(storageKey: string): string {
        if(typeof (window.localStorage) != 'undefined') {
            var currentDate = new Date();
            var raw = window.localStorage.getItem(storageKey);
            if(raw) {
                var data = JSON.parse(raw)
                var expiresAt = data.expiresAt;
                if(currentDate > new Date(expiresAt)) {
                    window.localStorage.removeItem(storageKey);
                    return null;
                } 
                return data.value;
            }
        }           
    }
}