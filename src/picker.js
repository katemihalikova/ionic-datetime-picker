angular.module("ion-datetime-picker", ["ionic"])
    .directive("ionDatetimePicker", function() {
        return {
            restrict: "AE",
            require: "ngModel",
            scope: {
                modelDate: "=ngModel",
                title: "=?",
                subTitle: "=?",
                buttonOk: "=?",
                buttonCancel: "=?",
                monthStep: "=?",
                hourStep: "=?",
                minuteStep: "=?",
                secondStep: "=?",
                onlyValid: "=?"
            },
            controller: function($scope, $ionicPopup, $ionicPickerI18n, $timeout) {
                $scope.i18n = $ionicPickerI18n;
                $scope.bind = {};

                $scope.rows = [0, 1, 2, 3, 4, 5];
                $scope.cols = [1, 2, 3, 4, 5, 6, 7];
                $scope.weekdays = [0, 1, 2, 3, 4, 5, 6];

                var lastDateSet = {
                    year: $scope.year,
                    month: $scope.month,
                    day: $scope.day,
                    hour: $scope.hour,
                    minute: $scope.minute,
                    second: $scope.second,
                    date: new Date(),
                    getDateWithoutTime: function(){
                        var tempDate = new Date(this.date);
                        tempDate.setHours(0, 0, 0, 0, 0);
                        return tempDate;
                    }
                };

                $scope.showPopup = function() {
                    $ionicPopup.show({
                        templateUrl: "lib/ion-datetime-picker/src/picker-popup.html",
                        title: $scope.title || ("Pick " + ($scope.dateEnabled ? "a date" : "") + ($scope.dateEnabled && $scope.timeEnabled ? " and " : "") + ($scope.timeEnabled ? "a time" : "")),
                        subTitle: $scope.subTitle || "",
                        scope: $scope,
                        cssClass: 'ion-datetime-picker-popup',
                        buttons: [
                            {
                                text: $scope.buttonOk || $scope.i18n.ok,
                                type: "button-positive",
                                onTap: function() {
                                    $scope.commit();
                                }
                            }, {
                                text: $scope.buttonCancel || $scope.i18n.cancel,
                                type: "button-stable",
                                onTap: function() {
                                    $timeout(function() {
                                        $scope.processModel();
                                    }, 200);
                                }
                            }
                        ]
                    });
                };

                $scope.prepare = function() {
                    if ($scope.mondayFirst) {
                        $scope.weekdays.push($scope.weekdays.shift());
                    }
                };

                $scope.processModel = function() {
                    var date = $scope.modelDate instanceof Date ? $scope.modelDate : new Date();
                    $scope.year = $scope.dateEnabled ? date.getFullYear() : 0;
                    $scope.month = $scope.dateEnabled ? date.getMonth() : 0;
                    $scope.day = $scope.dateEnabled ? date.getDate() : 0;
                    $scope.hour = $scope.timeEnabled ? date.getHours() : 0;
                    $scope.minute = $scope.timeEnabled ? date.getMinutes() : 0;
                    $scope.second = $scope.secondsEnabled ? date.getSeconds() : 0;

                    changeViewData();
                };

                function setNextValidDate(date, dayToAdd){
                    dayToAdd = dayToAdd || 0;
                    if (dayToAdd !== 0) {
                        date.setDate(date.getDate() + dayToAdd);
                    }

                    lastDateSet.year = date.getFullYear();
                    lastDateSet.month = date.getMonth();
                    lastDateSet.day = date.getDate();
                    lastDateSet.hour = date.getHours();
                    lastDateSet.minute = date.getMinutes();
                    lastDateSet.second = date.getSeconds();
                    lastDateSet.date = date;

                }

                function setLastValidDate(){
                    var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
                    if ($scope.isEnabled(date.getDate(), true)) {
                        setNextValidDate(date);
                    } else {
                        $scope.year = lastDateSet.year;
                        $scope.month = lastDateSet.month;
                        $scope.day = lastDateSet.day;
                        $scope.hour = lastDateSet.hour;
                        $scope.minute = lastDateSet.minute;
                        $scope.second = lastDateSet.second;
                    }
                }

                var changeViewData = function() {
                    setLastValidDate();
                    var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);

                    if ($scope.dateEnabled) {
                        $scope.year = date.getFullYear();
                        $scope.month = date.getMonth();
                        $scope.day = date.getDate();

                        $scope.bind.year = $scope.year;
                        $scope.bind.month = $scope.month.toString();

                        $scope.firstDay = new Date($scope.year, $scope.month, 1).getDay();
                        if ($scope.mondayFirst) {
                            $scope.firstDay = ($scope.firstDay || 7) - 1;
                        }
                        $scope.daysInMonth = getDaysInMonth($scope.year, $scope.month);
                    }

                    if ($scope.timeEnabled) {
                        $scope.hour = date.getHours();
                        $scope.minute = date.getMinutes();
                        $scope.second = date.getSeconds();
                        $scope.meridiem = $scope.hour < 12 ? "AM" : "PM";

                        $scope.bind.hour = $scope.meridiemEnabled ? ($scope.hour % 12 || 12).toString() : $scope.hour.toString();
                        $scope.bind.minute = ($scope.minute < 10 ? "0" : "") + $scope.minute.toString();
                        $scope.bind.second = ($scope.second < 10 ? "0" : "") + $scope.second.toString();
                        $scope.bind.meridiem = $scope.meridiem;
                    }
                };

                var getDaysInMonth = function(year, month) {
                    return new Date(year, month + 1, 0).getDate();
                };

                $scope.changeBy = function(value, unit) {
                    if (+value) {
                        // DST workaround
                        if ((unit === "hour" || unit === "minute") && value === -1) {
                            var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour - 1, $scope.minute);
                            if (($scope.minute === 0 || unit === "hour") && $scope.hour === date.getHours()) {
                                $scope.hour--;
                            }
                        }
                        $scope[unit] += +value;
                        if (unit === "month" || unit === "year") {
                            $scope.day = Math.min($scope.day, getDaysInMonth($scope.year, $scope.month));
                        }
                        changeViewData();
                    }
                };
                $scope.change = function(unit) {
                    var value = $scope.bind[unit];
                    if (value && unit === "meridiem") {
                        value = value.toUpperCase();
                        if (value === "AM" && $scope.meridiem === "PM") {
                            $scope.hour -= 12;
                        } else if (value === "PM" && $scope.meridiem === "AM") {
                            $scope.hour += 12;
                        }
                        changeViewData();
                    } else if (+value || value === "0") {
                        $scope[unit] = +value;
                        if (unit === "month" || unit === "year") {
                            $scope.day = Math.min($scope.day, getDaysInMonth($scope.year, $scope.month));
                        }
                        changeViewData();
                    }
                };
                $scope.changeDay = function(day) {
                    $scope.day = day;
                    changeViewData();
                };

                function createDate(stringDate){
                    var date = new Date(stringDate);
                    var isInvalidDate = isNaN(date.getTime());
                    if (isInvalidDate) {
                        date = new Date();//today
                    }
                    date.setHours(0, 0, 0, 0, 0);
                    return date;
                }

                $scope.isEnabled = function(day, computeNextValidDate) {
                    if (!$scope.onlyValid) {
                        return true;
                    }

                    var currentDate = new Date($scope.year, $scope.month, day);
                    var isValid = true;

                    if ($scope.onlyValid.after) {

                        var afterDate = createDate($scope.onlyValid.after);

                        if ($scope.onlyValid.inclusive) {
                            isValid = currentDate >= afterDate;
                            if (!isValid && computeNextValidDate) setNextValidDate(afterDate, 0);
                        } else {
                            isValid = currentDate > afterDate;
                            if (!isValid && computeNextValidDate) setNextValidDate(afterDate, 1);
                        }

                    } else
                    if ($scope.onlyValid.before){

                        var beforeDate = createDate($scope.onlyValid.after);

                        if ($scope.onlyValid.inclusive) {
                            isValid = currentDate <= beforeDate;
                            if (!isValid && computeNextValidDate) setNextValidDate(beforeDate, 0);
                        } else {
                            isValid = currentDate < beforeDate;
                            if (!isValid && computeNextValidDate) setNextValidDate(beforeDate, -1);
                        }

                    } else
                    if ($scope.onlyValid.between){

                        var initialDate = createDate($scope.onlyValid.between.initial);
                        var finalDate = createDate($scope.onlyValid.between.final);

                        if ($scope.onlyValid.inclusive) {
                            isValid = currentDate >= initialDate && currentDate <= finalDate;
                            if (!isValid && computeNextValidDate) {
                                if (currentDate < initialDate) setNextValidDate(initialDate, 0);
                                if (currentDate > finalDate) setNextValidDate(finalDate, 0);
                            }
                        } else {
                            isValid = currentDate > initialDate && currentDate < finalDate;
                            if (!isValid && computeNextValidDate) {
                                if (currentDate <= initialDate) setNextValidDate(initialDate, 1);
                                if (currentDate >= finalDate) setNextValidDate(finalDate, -1);
                            }
                        }

                    } else
                    if ($scope.onlyValid.outside){

                        var initialDate = createDate($scope.onlyValid.outside.initial);
                        var finalDate = createDate($scope.onlyValid.outside.final);

                        if ($scope.onlyValid.inclusive) {
                            isValid = currentDate <= initialDate || currentDate >= finalDate;
                            if (!isValid && computeNextValidDate) {
                                var lastValidDate = lastDateSet.getDateWithoutTime();
                                if (lastValidDate <= initialDate) setNextValidDate(finalDate, 0);
                                if (lastValidDate >= finalDate) setNextValidDate(initialDate, 0);
                            }
                        } else {
                            isValid = currentDate < initialDate || currentDate > finalDate;
                            if (!isValid && computeNextValidDate) {
                                var lastValidDate = lastDateSet.getDateWithoutTime();
                                if (lastValidDate < initialDate) setNextValidDate(finalDate, 1);
                                if (lastValidDate > finalDate) setNextValidDate(initialDate, -1);
                            }
                        }

                    }
                    return isValid

                };
                $scope.changed = function() {
                    changeViewData();
                };

                if ($scope.dateEnabled) {
                    $scope.$watch(function() {
                        return new Date().getDate();
                    }, function() {
                        var today = new Date();
                        $scope.today = {
                            day: today.getDate(),
                            month: today.getMonth(),
                            year: today.getFullYear()
                        };
                    });
//                    $scope.goToToday = function() {
//                        $scope.year = $scope.today.year;
//                        $scope.month = $scope.today.month;
//                        $scope.day = $scope.today.day;
//
//                        changeViewData();
//                    };
                }
            },
            link: function($scope, $element, $attrs, ngModelCtrl) {
                $scope.dateEnabled = "date" in $attrs && $attrs.date !== "false";
                $scope.timeEnabled = "time" in $attrs && $attrs.time !== "false";
                if ($scope.dateEnabled === false && $scope.timeEnabled === false) {
                    $scope.dateEnabled = $scope.timeEnabled = true;
                }

                $scope.mondayFirst = "mondayFirst" in $attrs && $attrs.mondayFirst !== "false";
                $scope.secondsEnabled = $scope.timeEnabled && "seconds" in $attrs && $attrs.seconds !== "false";
                $scope.meridiemEnabled = $scope.timeEnabled && "amPm" in $attrs && $attrs.amPm !== "false";

                $scope.monthStep = +$scope.monthStep || 1;
                $scope.hourStep = +$scope.hourStep || 1;
                $scope.minuteStep = +$scope.minuteStep || 1;
                $scope.secondStep = +$scope.secondStep || 1;

                $scope.prepare();

                ngModelCtrl.$render = function() {
                    $scope.modelDate = ngModelCtrl.$viewValue;
                    $scope.processModel();
                };

                $scope.commit = function() {
                    $scope.modelDate = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
                    ngModelCtrl.$setViewValue($scope.modelDate);
                };

                $element.on("click", $scope.showPopup);
            }
        };
    });
