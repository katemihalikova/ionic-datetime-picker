angular.module("ion-datetime-picker")
  .factory("$ionicPickerI18n", function($window) {
    return {
      pick: "Pick ",
      date: "a date",
      time: "a time",
      and: " and ",
      ok: "OK",
      cancel: "Cancel",
      clear: "Clear",
      okClass: "button-positive",
      cancelClass: "button-stable",
      clearClass: "button-light",
      arrowButtonClass: "button-positive",
      weekdays: $window.moment ? $window.moment.weekdaysMin() : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: $window.moment ? $window.moment.months() : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };
  });