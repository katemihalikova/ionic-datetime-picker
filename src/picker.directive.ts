import { Directive, Input } from "@angular/core";
import { DateTime } from "ionic-angular";
import { deepCopy } from "ionic-angular/util/util";

import { DatetimePickerAlertController } from "./alert.controller";
import { DatetimePickerAlertOptions } from "./alert.options";

@Directive({
  selector: "ion-datetime[picker]",
})
export class DatetimePickerDirective {
  @Input() public date: boolean | string;
  @Input() public time: boolean | string;
  @Input() public mondayFirst: boolean | string;
  @Input() public seconds: boolean | string;
  @Input() public amPm: boolean | string;
  @Input() public onlyValid: any;
  @Input() public title: string;
  @Input() public subTitle: string;

  constructor(
    private input: DateTime,
    private datetimePickerAlertController: DatetimePickerAlertController,
  ) {
    this.input.open = () => this.open();
  }

  private open() {
    if (this.input.isFocus() || this.input._disabled) {
      return;
    }

    const pickerOptions: DatetimePickerAlertOptions = deepCopy(this.input.pickerOptions);

    pickerOptions.dateEnabled = this.date !== undefined && this.date !== "false";
    pickerOptions.timeEnabled = this.time !== undefined && this.time !== "false";
    pickerOptions.isMondayFirst = this.mondayFirst !== undefined && this.mondayFirst !== "false";
    pickerOptions.secondsEnabled = this.seconds !== undefined && this.seconds !== "false";
    pickerOptions.meridiemEnabled = this.amPm !== undefined && this.amPm !== "false";
    pickerOptions.onlyValid = this.onlyValid;

    if (pickerOptions.dateEnabled === false && pickerOptions.timeEnabled === false) {
      pickerOptions.dateEnabled = pickerOptions.timeEnabled = true;
    }

    pickerOptions.monthNames = this.input._locale.monthNames || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    pickerOptions.weekdayNames = this.input._locale.dayShortNames || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    pickerOptions.title = this.title || ("Pick " + (pickerOptions.dateEnabled ? "a date" : "") + (pickerOptions.dateEnabled && pickerOptions.timeEnabled ? " and " : "") + (pickerOptions.timeEnabled ? "a time" : ""));
    pickerOptions.subTitle = this.subTitle;

    let val = this.input.value || {};
    let now = new Date();
    pickerOptions.modelDate = new Date(
      val.year || (pickerOptions.dateEnabled ? now.getFullYear() : 2018),
      val.month ? val.month - 1 : (pickerOptions.dateEnabled ? now.getMonth() : 0),
      val.day || (pickerOptions.dateEnabled ? now.getDate() : 1),
      val.hour || (pickerOptions.timeEnabled ? now.getHours() : 0),
      val.minute || (pickerOptions.timeEnabled ? now.getMinutes() : 0),
      val.second || (pickerOptions.timeEnabled && pickerOptions.secondsEnabled ? now.getSeconds() : 0),
    );

    const picker = this.datetimePickerAlertController.create(pickerOptions);
    picker.addButton({
      text: this.input.cancelText,
      role: "cancel",
      handler: () => this.input.ionCancel.emit(this),
    });
    picker.addButton({
      text: this.input.doneText,
      handler: (data: any) => this.input.value = data,
    });

    picker.ionChange.subscribe(() => {
      picker.refresh();
    });

    this.input._fireFocus();
    picker.present();
    picker.onDidDismiss(() => {
      this.input._fireBlur();
    });
  }
}
