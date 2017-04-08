# ion-datetime-picker
![GitHub version](https://img.shields.io/github/release/katemihalikova/ion-datetime-picker.svg?style=flat-square)
![Bower version](https://img.shields.io/bower/v/ion-datetime-picker.svg?style=flat-square)
![npm version](https://img.shields.io/npm/v/ion-datetime-picker.svg?style=flat-square)
![Ionic version](https://img.shields.io/badge/ionic-%5E1.0.0--beta.9-yellow.svg?style=flat-square)
![License](https://img.shields.io/github/license/katemihalikova/ion-datetime-picker.svg?style=flat-square)
<br>
![GitHub issues](https://img.shields.io/github/issues/katemihalikova/ion-datetime-picker.svg?style=flat-square)
![GitHub issue stats](http://issuestats.com/github/katemihalikova/ion-datetime-picker/badge/issue?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/katemihalikova/ion-datetime-picker.svg?style=flat-square)
![Github pull request stats](http://issuestats.com/github/katemihalikova/ion-datetime-picker/badge/pr?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/katemihalikova/ion-datetime-picker.svg?style=flat-square)

> Date and/or time picker for awesome [Ionic framework](http://ionicframework.com/) v1

# Introduction

I made this component because of poor implementation of native datetime picker in Android webview. How funny it was when I discovered that I can only pick a time between 0:00 and 11:59 on my 24-hour clock phone :)

*Looking for a [picker](http://blog.ionic.io/ionic-2-fixing-date-inputs-for-the-mobile-web/) that works with Ionic framework v2?*

# Features

The ion-datetime-picker component has these features:
- Make Date picker, Time picker, Datetime picker
- Choose Sunday or Monday as the first day of the week
- Use 12-hour or 24-hour clock
- Pick time with or without seconds
- Configure popup title and button labels and classes
- Configure i18n to get weekdays and months in your language
- Configure size of a step

# Demo

Demo app is available - enter code `8d75a0ec` into [Ionic View](http://view.ionic.io/).
Live demo is available on [Codepen](http://codepen.io/katemihalikova/full/dYvjzP/).

#Screenshots

<img src="/../screenshots/date.png?raw=true" alt="Date picker" width="239">
<img src="/../screenshots/time.png?raw=true" alt="Time picker" width="239">
<img src="/../screenshots/datetime.png?raw=true" alt="Datetime picker" width="239">

# Installation

1. Use bower or npm to install the new module:

    ```bash
    bower install ion-datetime-picker --save
    ```

    ```bash
    npm install ion-datetime-picker --save
    ```

2. Import the `ion-datetime-picker` javascript and css file into your HTML file (or use [wiredep](https://github.com/taptapship/wiredep)):

    ```html
    <script src="lib/ion-datetime-picker/release/ion-datetime-picker.min.js"></script>
    <link href="lib/ion-datetime-picker/release/ion-datetime-picker.min.css" rel="stylesheet">
    ```

3. Add `ion-datetime-picker` as a dependency on your Ionic app:

    ```javascript
    angular.module("myApp", ["ionic", "ion-datetime-picker"]);
    ```

# Usage

Put the `ion-datetime-picker` directive alongside the `ng-model` wherever you want to tap to show the picker:

```html
<ion-list>
  <div class="item" ion-datetime-picker ng-model="datetimeValue">
    {{datetimeValue| date: "yyyy-MM-dd H:mm:ss"}}
  </div>
</ion-list>
```

*It is not possible to use `<ion-item>` until [#18](https://github.com/katemihalikova/ion-datetime-picker/issues/18) is fixed.*


## Configuration attributes

### `date` and `time` attributes

Choose which picker type is used. When neither is set, I assume both and use the datetime picker.

### `monday-first` attribute

Set this if you want to have Monday as the first day of a week.

### `seconds` attribute

By default, in the time picker, I allow to change only hours and minutes. Set this attribute to use also seconds.

### `am-pm` attribute

By default, in the time picker, I use 24-hour clock. Set this attribute to change it to 12-hour clock.

### `month-step`, `hour-step`, `minute-step` and `second-step` attributes

By default, when any caret button is tapped, I add or subtract 1 particular unit. Set these attributes to change it to anything you want.

### `title` and `sub-title` attributes

Configure the title and sub title of the popup with the picker.

_HINT: Use `data-title` instead of `title` if you are going to use the app in the desktop browser to prevent leaking of the text into a mouseover tooltip._

### `button-ok` and `button-cancel` attributes

Configure the text of buttons at the bottom of the picker.

### `only-valid` attribute

Disable/Enable calendar days according to type and date range specified.

```html
only-valid="{'after': '2016-04-09'}"
only-valid="{'after': 'today', 'inclusive': true}"
only-valid="{'outside': {'initial': '2016-04-09', 'final': '2016-06-15'}, 'inclusive': true}"
```

Types supported: `'after'`, `'before'`, `'between'` and `'outside'`. If you want to include the day specified, set `'inclusive'` property to `true`.

To combine rules, just pass an array and it should do the trick. Rules are complementary (treated with AND, not OR), it means that a date will be available only if it matches all the constraints you pass.

```html
only-valid="[{'after': '2017-01-12'}, {'outside': {'initial': '2017-01-19', 'final': '2017-01-29'}}, {'outside': {'initial': '2017-02-19', 'final': '2017-02-29'}}]"
```

## Internationalization & customization factory

Simple internationalization & customization options. Inject the `$ionicPickerI18n` factory into your code and set the localized strings and button classes.

### `weekdays` key

Array of weekdays abbreviations. `0` is Sunday. If `moment` is installed, I try to get localized data from it, otherwise English ones are used as default.

### `months` key

Array of months names. `0` is January. If `moment` is installed, I try to get localized data from it, otherwise English ones are used as default.

### `ok` and `cancel` keys

Default, global labels of the buttons at the bottom of the picker.

### `okClass`, `cancelClass` and `arrowButtonClass` keys

Custom space-delimited classes applied to the buttons at the bottom of the picker.

```js
angular.module("myApp")
  .run(function($ionicPickerI18n) {
    $ionicPickerI18n.weekdays = ["Нд", "Lu", "Út", "Mi", "To", "금", "Sá"];
    $ionicPickerI18n.months = ["Janvier", "Febrero", "März", "四月", "Maio", "Kesäkuu", "Červenec", "अगस्त", "Вересень", "Październik", "Νοέμβριος", "డిసెంబర్"];
    $ionicPickerI18n.ok = "オーケー";
    $ionicPickerI18n.cancel = "Cancelar";
    $ionicPickerI18n.okClass = "button-positive";
    $ionicPickerI18n.cancelClass = "button-stable";
    $ionicPickerI18n.arrowButtonClass = "button-positive";
  });
```

## Daylight saving time

The datetime picker is using `Date` object with your browser's timezone, including any DST. When you change the date, hour, minute, or second, which sets the time to an invalid value because of moving from 2:00 to 3:00 at the beginning of DST, the time is automatically adjusted to a valid value. On the other hand, when the DST ends, I do NOT take the inserted hour into consideration, but this may be fixed in the future.
