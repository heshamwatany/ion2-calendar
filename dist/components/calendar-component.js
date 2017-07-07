import { ChangeDetectorRef, Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import * as fns from 'date-fns';
import { Content, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import { CalendarService } from '../services/calendar.service';
import { TranslateService } from '@ngx-translate/core';
export var CalendarComponent = (function () {
    function CalendarComponent(_renderer, _elementRef, params, viewCtrl, ref, calSvc, translate) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.ref = ref;
        this.calSvc = calSvc;
        this.translate = translate;
        this.dayTemp = [null, null];
        this.monthTitleFilterStr = '';
        this.weekdaysTitle = [];
        this.weekStartDay = 0;
        this.debug = true;
        this._s = true;
        this._color = 'primary';
        translate.setDefaultLang('en');
        this.findCssClass();
        this.init();
        // this.getHistory();
    }
    CalendarComponent.prototype.ionViewDidLoad = function () {
        if (this.mode === 'day' || this.mode === 'week' || this.mode === 'custom') {
            this.scrollToDefaultDate();
        }
        if (this.mode !== 'month' && this.content.enableScrollListener && this.scrollBackwards) {
            this.content.enableScrollListener();
        }
    };
    CalendarComponent.prototype.init = function () {
        var params = this.params;
        // console.log(params);
        this._d = params.get('options');
        //console.log(`lang: ${this._d.lang}`);
        this.translate.use(this._d.lang);
        this.fns = fns;
        var startTime = moment(this._d.from).valueOf();
        var endTime = moment(this._d.to).valueOf();
        // console.log(startTime);
        // console.log(endTime);
        this.options = {
            start: startTime,
            end: endTime,
            isRadio: params.get('isRadio'),
            range_beg: startTime,
            range_end: endTime,
            daysConfig: params.get('daysConfig'),
            disableWeekdays: params.get('disableWeekdays'),
            monthTitle: params.get('monthTitle'),
        };
        // added
        this.mode = this._d.mode;
        // added
        console.log(this.mode);
        this.defaultDate = this._d.defaultDate;
        //this.year = this.defaultDate.getFullYear();
        this.scrollBackwards = this._d.canBackwardsSelected;
        this.weekStartDay = this._d.weekStartDay;
        this._id = this._d.id;
        this.monthTitleFilterStr = this._d.monthTitle;
        this.weekdaysTitle = this._d.weekdaysTitle;
        this.title = this._d.title;
        this.closeLabel = this._d.closeLabel;
        this.closeIcon = this._d.closeIcon;
        this.isSaveHistory = this._d.isSaveHistory;
        this.countNextMonths = this._d.countNextMonths;
        if (this.countNextMonths < 1) {
            this.countNextMonths = 1;
        }
        this.showYearPicker = this._d.showYearPicker;
        if (this.showYearPicker) {
            this.createYearPicker(startTime, endTime);
        }
        else {
            this.calendarMonths = this.calSvc.createMonthsByPeriod(startTime, this.findInitMonthNumber(this.defaultDate) + this.countNextMonths, this._d);
        }
    };
    CalendarComponent.prototype.findCssClass = function () {
        var _this = this;
        var cssClass = this.params.get('cssClass');
        if (cssClass) {
            cssClass.split(' ').forEach(function (cssClass) {
                if (cssClass.trim() !== '')
                    _this._renderer.setElementClass(_this._elementRef.nativeElement, cssClass, true);
            });
        }
    };
    CalendarComponent.prototype.onChange = function (data) {
        // this.calSvc.savedHistory(data, this._id);
        this.ref.detectChanges();
    };
    CalendarComponent.prototype.selectMonthHandler = function (data) {
        var monthStartDate = fns.startOfMonth(data);
        var monthEndDate = fns.endOfMonth(data);
        if (fns.isAfter(monthEndDate, this._d.to)) {
            monthEndDate = this._d.to;
        }
        if (fns.isBefore(monthStartDate, this._d.from)) {
            monthStartDate = this._d.from;
        }
        this.dayTemp[0] = this.calSvc.createCalendarDayForMonth(monthStartDate);
        this.dayTemp[1] = this.calSvc.createCalendarDayForMonth(monthEndDate);
    };
    CalendarComponent.prototype.selectHandler = function (month, date, mode) {
        var endOfday = fns.toDate(date.time);
        var startOfday = mode === 'week' ? fns.addDays(fns.subWeeks(endOfday, 1), 1) :
            fns.subMonths(endOfday, 1);
        if (fns.isBefore(startOfday, this._d.from)) {
            startOfday = fns.toDate(this._d.from);
        }
        // let endOfday = mode === "week" ? fns.endOfISOWeek(date.time):
        // fns.endOfMonth(date.time);
        // console.log('--------------- before ----------------');
        console.log("FromDate: " + this._d.from);
        console.log("ToDate: " + this._d.to);
        if (this.dayTemp[0] !== null) {
            console.log('day[0] ' + fns.format(this.dayTemp[0].time, 'MM/DD/YYYY'));
            this.dayTemp[0].selected = false;
            this.dayTemp[0] = null;
        }
        if (this.dayTemp[1] !== null) {
            console.log('day[1] ' + fns.format(this.dayTemp[1].time, 'MM/DD/YYYY'));
            this.dayTemp[1].selected = false;
            this.dayTemp[1] = null;
        }
        for (var i = 0; i < month.days.length; i++) {
            if (month.days[i] !== null) {
                if (fns.isSameDay(startOfday, month.days[i].time)) {
                    this.dayTemp[0] = month.days[i];
                    this.dayTemp[0].selected = true;
                }
                if (fns.isSameDay(endOfday, month.days[i].time)) {
                    this.dayTemp[1] = month.days[i];
                    this.dayTemp[1].selected = true;
                }
            }
        }
        if (this.dayTemp[0] === null) {
            var monthIndex = this.calendarMonths.indexOf(month);
            if (monthIndex >= 1) {
                var prevMonth = this.calendarMonths[monthIndex - 1];
                for (var i = 0; i < prevMonth.days.length; i++) {
                    if (prevMonth.days[i] != null) {
                        // console.log(
                        //     'startOfWeek: ' + fns.format(startOfday, 'MM/DD/YYYY'));
                        // console.log(
                        //     'current day: ' +
                        //     fns.format(prevMonth.days[i].time, 'MM/DD/YYYY'));
                        if (fns.isSameDay(startOfday, prevMonth.days[i].time)) {
                            this.dayTemp[0] = prevMonth.days[i];
                            this.dayTemp[0].selected = true;
                            break;
                        }
                    }
                }
            }
            else {
                console.error('month index out of bound');
            }
        }
        if (this.dayTemp[1] === null) {
            var monthIndex = this.calendarMonths.indexOf(month);
            if (monthIndex < this.calendarMonths.length - 1) {
                var nextMonth = this.calendarMonths[monthIndex + 1];
                for (var i = 0; i < nextMonth.days.length; i++) {
                    if (nextMonth.days[i] != null) {
                        if (fns.isSameDay(endOfday, nextMonth.days[i].time)) {
                            this.dayTemp[1] = nextMonth.days[i];
                            this.dayTemp[1].selected = true;
                            break;
                        }
                    }
                }
            }
            else {
                console.error('month index out of bound');
            }
        }
        // console.log('--------------- After ----------------');
        // if (this.dayTemp[0] !== null) {
        //   console.log('day[0] ' + fns.format(this.dayTemp[0].time,
        //   'MM/DD/YYYY'));
        // }
        // if (this.dayTemp[1] !== null) {
        //   console.log('day[1] ' + fns.format(this.dayTemp[1].time,
        //   'MM/DD/YYYY'));
        // }
        this.ref.detectChanges();
    };
    CalendarComponent.prototype.onSelectDate = function (selected) {
        var month = selected.month;
        var date = selected.date;
        console.log('selected: ' + fns.toDate(date.time));
        if (this.mode === 'week' || this.mode === 'month') {
            this.selectHandler(month, date, this.mode);
        }
        else {
            console.error('unsupported selection mode');
        }
    };
    CalendarComponent.prototype.onCancel = function () { this.viewCtrl.dismiss(); };
    CalendarComponent.prototype.pad = function (n) {
        return (n < 10) ? ("0" + n) : n;
    };
    CalendarComponent.prototype.dateToString = function (convertDay, today) {
        var date = fns.toDate(convertDay);
        var yearOfDate = fns.getISOYear(date);
        var monthOfDate = this.pad(fns.getMonth(date) + 1);
        var dayOfDate = this.pad(fns.getDate(date));
        var hoursOfDate = this.pad(fns.getHours(today));
        var minutesOfDate = this.pad(fns.getMinutes(today));
        var secondsOfDate = this.pad(fns.getSeconds(today));
        return yearOfDate + "-" + monthOfDate + "-" + dayOfDate + " " + hoursOfDate + ":" + minutesOfDate + ":" + secondsOfDate + " GMT";
    };
    CalendarComponent.prototype.done = function () {
        // let from = fns.toDate(this.dayTemp[0].time);
        // let fromYear = fns.getISOYear(from);
        // let fromMonth = fns.getMonth(from);
        // let fromDay = fns.getDate(from);
        // let to = fns.toDate(this.dayTemp[1].time); 
        // let toYear = fns.getISOYear(from);
        var date = new Date();
        var today = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
        //console.log(`from: ${from}, to: ${to}, current: ${current}`);
        // this.viewCtrl.dismiss({
        //   from: this.dateToString(this.dayTemp[0].time, today),
        //   to: this.dateToString(this.dayTemp[1].time, today)
        // }); 
        var result = [];
        if (this.dayTemp[0] !== null) {
            result.push(this.dateToString(this.dayTemp[0].time, today));
        }
        if (this.dayTemp[1] !== null) {
            result.push(this.dateToString(this.dayTemp[1].time, today));
        }
        this.viewCtrl.dismiss(result);
    };
    CalendarComponent.prototype.canDone = function () {
        if (!Array.isArray(this.dayTemp)) {
            return false;
        }
        if (this._d.isRadio) {
            return !!(this.dayTemp[0] && this.dayTemp[0].time);
        }
        else {
            return !!(this.dayTemp[0] && this.dayTemp[1]) &&
                !!(this.dayTemp[0].time && this.dayTemp[1].time);
        }
    };
    CalendarComponent.prototype.getHistory = function () {
        if (this.isSaveHistory) {
            this.dayTemp = this.calSvc.getHistory(this._id);
        }
    };
    CalendarComponent.prototype.createYearPicker = function (startTime, endTime) {
        // init year array
        this.years = [];
        // getting max and be sure, it is in future (maybe parameter?)
        var maxYear = (new Date(endTime)).getFullYear();
        if (maxYear <= 1970) {
            maxYear = (new Date(this.defaultDate)).getFullYear() + 10;
            this.options.end = new Date(maxYear, 12, 0).getTime();
        }
        // min year should be okay, either it will be set or something like 1970 at
        // min
        var minYear = (new Date(startTime)).getFullYear();
        // calculating the needed years to be added to array
        var neededYears = (maxYear - minYear);
        // pushing years to selection array
        for (var y = 0; y <= neededYears; y++) {
            this.years.push(maxYear - y);
        }
        this.years.reverse();
        // selection-start-year of defaultDate
        this.year = this.defaultDate.getFullYear();
        var firstDayOfYear = new Date(this.year, 0, 1);
        var lastDayOfYear = new Date(this.year, 12, 0);
        // don't calc over the start / end
        if (firstDayOfYear.getTime() < this.options.start) {
            firstDayOfYear = new Date(this.options.start);
        }
        if (lastDayOfYear.getTime() > this.options.end) {
            lastDayOfYear = new Date(this.options.end);
        }
        // calcing the month
        this.calendarMonths = this.calSvc.createMonthsByPeriod(firstDayOfYear.getTime(), this.findInitMonthNumber(this.defaultDate) + this.countNextMonths, this._d);
        // sets the range new
        // checking whether the start is after firstDayOfYear
        this.options.range_beg = firstDayOfYear.getTime() < startTime ?
            startTime :
            firstDayOfYear.getTime();
        // checking whether the end is before lastDayOfYear
        this.options.range_end =
            lastDayOfYear.getTime() > endTime ? endTime : lastDayOfYear.getTime();
    };
    CalendarComponent.prototype.nextMonth = function (infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        var len = this.calendarMonths.length;
        var final = this.calendarMonths[len - 1];
        var nextTime = moment(final.original.time).add(1, 'M').valueOf();
        var rangeEnd = this.options.range_end ?
            moment(this.options.range_end).subtract(1, 'M') :
            0;
        if (len <= 0 ||
            (rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd))) {
            infiniteScroll.enable(false);
            return;
        }
        (_a = this.calendarMonths).push.apply(_a, this.calSvc.createMonthsByPeriod(nextTime, 1, this._d));
        infiniteScroll.complete();
        var _a;
    };
    CalendarComponent.prototype.backwardsMonth = function () {
        var first = this.calendarMonths[0];
        var firstTime = moment(first.original.time).subtract(1, 'M').valueOf();
        // console.log("range_beg: " + fns.toDate(this.options.range_beg));
        // console.log("range_end: " + fns.toDate(this.options.range_end));
        // console.log("firstTime: " + fns.toDate(firstTime));
        if (fns.isSameMonth(firstTime, this._d.from) ||
            (fns.isAfter(firstTime, this._d.from) &&
                fns.isBefore(firstTime, this._d.to))) {
            console.log('unshift begin!!!');
            (_a = this.calendarMonths).unshift.apply(_a, this.calSvc.createMonthsByPeriod(firstTime, 1, this._d));
            this.ref.detectChanges();
        }
        var _a;
    };
    CalendarComponent.prototype.scrollToDefaultDate = function () {
        var _this = this;
        var defaultDateIndex = this.findInitMonthNumber(this.defaultDate);
        var defaultDateMonth = this.monthsEle.nativeElement.children[("month-" + defaultDateIndex)]
            .offsetTop;
        if (defaultDateIndex === 0 || defaultDateMonth === 0)
            return;
        setTimeout(function () { _this.content.scrollTo(0, defaultDateMonth, 128); }, 200);
    };
    CalendarComponent.prototype.onScroll = function ($event) {
        var _this = this;
        if (!this.scrollBackwards)
            return;
        if ($event.scrollTop <= 200 && this._s) {
            this._s = !1;
            var lastHeight_1 = this.content.getContentDimensions().scrollHeight;
            setTimeout(function () {
                _this.backwardsMonth();
                var nowHeight = _this.content.getContentDimensions().scrollHeight;
                if (nowHeight - lastHeight_1 >= 5) {
                    _this.content.scrollTo(0, nowHeight - lastHeight_1, 0).then(function () {
                        _this._s = !0;
                    });
                }
            }, 300);
        }
    };
    /**
     *
     *
     * @param {Date} date
     * @returns {number}
     * @memberof CalendarComponent
     */
    CalendarComponent.prototype.findInitMonthNumber = function (date) {
        var startDate = moment(this.options.start);
        var defaultDate = moment(date);
        var isAfter = defaultDate.isAfter(startDate);
        if (!isAfter)
            return 0;
        if (this.showYearPicker) {
            startDate = moment(new Date(this.year, 0, 1));
        }
        return defaultDate.diff(startDate, 'month');
    };
    CalendarComponent.prototype.changedYearSelection = function () {
        var _this = this;
        // re-enabling infinite scroll
        if (this.infiniteScroll !== undefined) {
            this.infiniteScroll.enable(true);
        }
        // getting first day and last day of the year
        var firstDayOfYear = new Date(this.year, 0, 1);
        var lastDayOfYear = new Date(this.year, 12, 0);
        // don't calc over the start / end
        if (firstDayOfYear.getTime() < this.options.start) {
            firstDayOfYear = new Date(this.options.start);
        }
        if (lastDayOfYear.getTime() > this.options.end) {
            lastDayOfYear = new Date(this.options.end);
        }
        // sets the range new
        // checking whether the start is after firstDayOfYear
        this.options.range_beg = firstDayOfYear.getTime() < this.options.start ?
            this.options.start :
            firstDayOfYear.getTime();
        // checking whether the end is before lastDayOfYear
        this.options.range_end = lastDayOfYear.getTime() > this.options.end ?
            this.options.end :
            lastDayOfYear.getTime();
        // calcing the months
        var monthCount = (this.findInitMonthNumber(firstDayOfYear) + this.countNextMonths);
        // this.calendarMonths = this.calSvc.createMonthsByPeriod(
        //     firstDayOfYear.getTime(), monthCount <= 1 ? 3 : monthCount, this._d);
        // scrolling to the top
        // setTimeout(() => { this.content.scrollTo(0, 0, 128); }, 300);
        var monthOfLastDay = fns.startOfMonth(new Date(lastDayOfYear));
        var monthOfFirstDay = fns.startOfMonth(new Date(firstDayOfYear));
        var currentFirstMonth = fns.startOfMonth(this.calendarMonths[0].original.time);
        console.log("currentFirstMonth: " + currentFirstMonth + ", monthOfFirstDay: " + monthOfFirstDay + ", monthOfLastDay: " + monthOfLastDay);
        if (!(fns.isSameMonth(currentFirstMonth, monthOfFirstDay) ||
            fns.isBefore(currentFirstMonth, monthOfFirstDay))) {
            // insert needed month
            var diffMonths = fns.differenceInCalendarMonths(currentFirstMonth, monthOfFirstDay);
            (_a = this.calendarMonths).unshift.apply(_a, this.calSvc.createMonthsByPeriod(firstDayOfYear.getTime(), diffMonths, this._d));
            setTimeout(function () { _this.content.scrollTo(0, 0, 128); }, 200);
        }
        else {
            // search and scroll to date
            var i = void 0;
            for (i = 0; i < this.calendarMonths.length; i++) {
                if (fns.isSameMonth(monthOfFirstDay, this.calendarMonths[i].original.time)) {
                    break;
                }
            }
            if (i != this.calendarMonths.length) {
                var defaultDateMonth_1 = this.monthsEle.nativeElement.children[("month-" + i)].offsetTop;
                // if (i === 0 || defaultDateMonth === 0) return;
                setTimeout(function () { _this.content.scrollTo(0, defaultDateMonth_1, 128); }, 200);
            }
            else {
                console.error('changedYearSelection(): index out of bound');
            }
        }
        var _a;
    };
    CalendarComponent.decorators = [
        { type: Component, args: [{
                    template: "\n  <ion-header>\n    <ion-navbar [color]=\"_color\">\n\n        <ion-buttons start [hidden]=\"!showYearPicker\">\n            <ion-select [(ngModel)]=\"year\" (ngModelChange)=\"changedYearSelection()\" interface=\"popover\">\n                <ion-option *ngFor=\"let y of years\" value=\"{{y}}\">{{y}}</ion-option>\n            </ion-select>\n        </ion-buttons>\n\n        <ion-title>{{title | translate}}</ion-title>\n\n        <ion-buttons end>\n            <button ion-button clear *ngIf=\"closeLabel !== '' && !closeIcon\" (click)=\"onCancel()\">\n                {{closeLabel | translate}}\n            </button>\n            <button ion-button icon-only clear *ngIf=\"closeLabel === '' || closeIcon\" (click)=\"onCancel()\">\n                <ion-icon name=\"close\"></ion-icon>\n            </button>\n            <!--<button ion-button icon-only clear [disabled]=\"!canDone()\" (click)=\"done()\">\n                <ion-icon name=\"checkmark\"></ion-icon>\n            </button>-->\n        </ion-buttons>\n    </ion-navbar>\n      <ion-toolbar class=\"show-dates-bar\" no-border>\n        <ul class=\"date-items\">\n            <li *ngIf=\"_d.isRadio === false && dayTemp[0]\">{{ ((dayTemp[0].time | date: 'EEEE, dd MMM y').split(',')[0]|translate)+\", \"+pad(fns.getDate(dayTemp[0].time))+\" \"+(pad(fns.getMonth(dayTemp[0].time) + 1).toString() | translate) + \" \" + fns.getYear(dayTemp[0].time)}}</li>\n            <li class=\"full-row\" *ngIf=\"_d.isRadio === true && dayTemp[0]\">{{ ((dayTemp[0].time | date: 'EEEE, dd MMM y').split(',')[0]|translate)+\", \"+pad(fns.getDate(dayTemp[0].time))+\" \"+(pad(fns.getMonth(dayTemp[0].time) + 1).toString() | translate) + \" \" + fns.getYear(dayTemp[0].time)}}</li>\n            <li *ngIf=\"_d.isRadio === false && dayTemp[1]\" class=\"slash\">&#47;</li>\n            <!--<li *ngIf=\"_d.isRadio == false && dayTemp[1]\">{{ dayTemp[1].time | date: 'EEEE, dd MMM y' }}</li>-->\n            <li *ngIf=\"_d.isRadio === false && dayTemp[1]\">{{ ((dayTemp[1].time | date: 'EEEE, dd MMM y').split(',')[0]|translate)+\", \"+pad(fns.getDate(dayTemp[1].time))+\" \"+(pad(fns.getMonth(dayTemp[1].time) + 1).toString() | translate) + \" \" + fns.getYear(dayTemp[1].time)}}</li>\n        </ul>\n      </ion-toolbar>\n    <calendar-week-title *ngIf=\"mode === 'day' || mode === 'week' || mode === 'custom'\" [color]=\"_color\" [weekArray]=\"weekdaysTitle\" [weekStart]=\"weekStartDay\" no-border-top>\n    </calendar-week-title>\n  </ion-header>\n\n  <ion-content *ngIf=\"mode === 'day' || mode === 'week' || mode === 'custom'\" (ionScroll)=\"onScroll($event)\" class=\"calendar-page\" [ngClass]=\"{'multiSelection': !options.isRadio}\" no-bounce>\n\n      <div #months>\n          <div *ngFor=\"let month of calendarMonths;let i = index;\" class=\"month-box\" [attr.id]=\"'month-' + i\">\n              <!--<h4 class=\"text-center month-title\">{{month.original.date | date:monthTitleFilterStr}}</h4>-->\n              <h4 class=\"text-center month-title\">{{ (pad(fns.getMonth(month.original.date) + 1).toString() | translate) + \" \" + fns.getYear(month.original.date) }}</h4>\n              <ion2-month [month]=\"month\" [mode]=\"mode\" [isRadio]=\"options.isRadio\" [isSaveHistory]=\"isSaveHistory\" [id]=\"_id\" (onChange)=\"onChange($event)\"\n                  (onSelectDate)=\"onSelectDate($event) \"[(ngModel)]=\"dayTemp\">\n              </ion2-month>\n          </div>\n      </div>\n\n      <ion-infinite-scroll (ionInfinite)=\"nextMonth($event)\">\n          <ion-infinite-scroll-content></ion-infinite-scroll-content>\n      </ion-infinite-scroll>\n  </ion-content>\n\n  <ion-content *ngIf=\"mode === 'month'\" no-bounce>\n    <monthpick [today]=\"defaultDate\" (onSelectMonth)=\"selectMonthHandler($event)\"></monthpick>\n  </ion-content>\n  <ion-footer no-shadow>\n\t\t<button ion-button full [disabled]=\"!canDone()\" (click)=\"done()\">{{\"Save\" | translate}}</button>\n  </ion-footer>",
                    selector: 'calendar-page'
                },] },
    ];
    /** @nocollapse */
    CalendarComponent.ctorParameters = function () { return [
        { type: Renderer, },
        { type: ElementRef, },
        { type: NavParams, },
        { type: ViewController, },
        { type: ChangeDetectorRef, },
        { type: CalendarService, },
        { type: TranslateService, },
    ]; };
    CalendarComponent.propDecorators = {
        'content': [{ type: ViewChild, args: [Content,] },],
        'monthsEle': [{ type: ViewChild, args: ['months',] },],
    };
    return CalendarComponent;
}());
//# sourceMappingURL=calendar-component.js.map