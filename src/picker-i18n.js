angular.module("ion-datetime-picker")
    .factory("$ionicPickerI18n", function($window) {
        return  {
            ok: "OK",
            cancel: "Cancel",
            okClass: "button-positive",
            cancelClass: "button-stable",
            weekdays: $window.moment ? $window.moment.weekdaysMin() : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            months: $window.moment ? $window.moment.months() : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        };
    });