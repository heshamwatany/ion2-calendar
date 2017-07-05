import {ChangeDetectorRef, Component, ElementRef, Renderer, ViewChild} from '@angular/core';
import * as fns from 'date-fns';
import {Content, InfiniteScroll, NavParams, ViewController} from 'ionic-angular';
import * as moment from 'moment';

import {CalendarControllerOptions, CalendarDay, CalendarMonth, CalendarOptions} from '../calendar.model'
import {CalendarService} from '../services/calendar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  template: `
  <ion-header>
    <ion-navbar [color]="_color">

        <ion-buttons start [hidden]="!showYearPicker">
            <ion-select [(ngModel)]="year" (ngModelChange)="changedYearSelection()" interface="popover">
                <ion-option *ngFor="let y of years" value="{{y}}">{{y}}</ion-option>
            </ion-select>
        </ion-buttons>

        <ion-title>{{title | translate}}</ion-title>

        <ion-buttons end>
            <button ion-button clear *ngIf="closeLabel !== '' && !closeIcon" (click)="onCancel()">
                {{closeLabel | translate}}
            </button>
            <button ion-button icon-only clear *ngIf="closeLabel === '' || closeIcon" (click)="onCancel()">
                <ion-icon name="close"></ion-icon>
            </button>
            <!--<button ion-button icon-only clear [disabled]="!canDone()" (click)="done()">
                <ion-icon name="checkmark"></ion-icon>
            </button>-->
        </ion-buttons>
    </ion-navbar>
      <ion-toolbar class="show-dates-bar" no-border>
        <ul class="date-items">
            <li *ngIf="_d.isRadio === false && dayTemp[0]">{{ ((dayTemp[0].time | date: 'EEEE, dd MMM y').split(',')[0]|translate)+", "+pad(fns.getDate(dayTemp[0].time))+" "+(pad(fns.getMonth(dayTemp[0].time) + 1).toString() | translate) + " " + fns.getYear(dayTemp[0].time)}}</li>
            <li class="full-row" *ngIf="_d.isRadio === true && dayTemp[0]">{{ ((dayTemp[0].time | date: 'EEEE, dd MMM y').split(',')[0]|translate)+", "+pad(fns.getDate(dayTemp[0].time))+" "+(pad(fns.getMonth(dayTemp[0].time) + 1).toString() | translate) + " " + fns.getYear(dayTemp[0].time)}}</li>
            <li *ngIf="_d.isRadio === false && dayTemp[1]" class="slash">&#47;</li>
            <!--<li *ngIf="_d.isRadio == false && dayTemp[1]">{{ dayTemp[1].time | date: 'EEEE, dd MMM y' }}</li>-->
            <li *ngIf="_d.isRadio === false && dayTemp[1]">{{ ((dayTemp[1].time | date: 'EEEE, dd MMM y').split(',')[0]|translate)+", "+pad(fns.getDate(dayTemp[1].time))+" "+(pad(fns.getMonth(dayTemp[1].time) + 1).toString() | translate) + " " + fns.getYear(dayTemp[1].time)}}</li>
        </ul>
      </ion-toolbar>
    <calendar-week-title *ngIf="mode === 'day' || mode === 'week' || mode === 'custom'" [color]="_color" [weekArray]="weekdaysTitle" [weekStart]="weekStartDay" no-border-top>
    </calendar-week-title>
  </ion-header>

  <ion-content *ngIf="mode === 'day' || mode === 'week' || mode === 'custom'" (ionScroll)="onScroll($event)" class="calendar-page" [ngClass]="{'multiSelection': !options.isRadio}" no-bounce>

      <div #months>
          <div *ngFor="let month of calendarMonths;let i = index;" class="month-box" [attr.id]="'month-' + i">
              <!--<h4 class="text-center month-title">{{month.original.date | date:monthTitleFilterStr}}</h4>-->
              <h4 class="text-center month-title">{{ (pad(fns.getMonth(month.original.date) + 1).toString() | translate) + " " + fns.getYear(month.original.date) }}</h4>
              <ion2-month [month]="month" [mode]="mode" [isRadio]="options.isRadio" [isSaveHistory]="isSaveHistory" [id]="_id" (onChange)="onChange($event)"
                  (onSelectDate)="onSelectDate($event) "[(ngModel)]="dayTemp">
              </ion2-month>
          </div>
      </div>

      <ion-infinite-scroll (ionInfinite)="nextMonth($event)">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
  </ion-content>

  <ion-content *ngIf="mode === 'monh'" no-bounce>
    <monthpick [today]="defaultDate" (onSelectMonth)="selectMonthHandler($event)"></monthpick>
  </ion-content>
  <ion-footer no-shadow>
		<button ion-button full [disabled]="!canDone()" (click)="done()">{{"Save" | translate}}</button>
  </ion-footer>`,
  selector: 'calendar-page'
})
export class CalendarComponent {
  @ViewChild(Content) content: Content;
  @ViewChild('months') monthsEle: ElementRef;

  title: string;
  closeLabel: string;
  dayTemp: Array<CalendarDay|null> = [null, null];
  calendarMonths: Array<CalendarMonth>;
  monthTitleFilterStr = '';
  weekdaysTitle: Array<string> = [];
  defaultDate: Date;
  scrollBackwards: boolean;
  weekStartDay: number = 0;
  isSaveHistory: boolean;
  countNextMonths: number;
  showYearPicker: boolean;
  year: number;
  years: Array<number>;
  infiniteScroll: InfiniteScroll;
  closeIcon: boolean;
  options: CalendarOptions;
  fns: any;
  debug = true;

  _s: boolean = true;
  _id: string;
  _color: string = 'primary';
  _d: CalendarControllerOptions;
  mode: string;

  constructor(
      private _renderer: Renderer, public _elementRef: ElementRef,
      public params: NavParams, public viewCtrl: ViewController,
      public ref: ChangeDetectorRef, public calSvc: CalendarService,
      public translate: TranslateService
      ) {
    translate.setDefaultLang('en');
    this.findCssClass();
    this.init();
    // this.getHistory();
  }

  ionViewDidLoad() {
    if (this.mode === 'day' || this.mode === 'week' || this.mode === 'custom') {
      this.scrollToDefaultDate();
    }

    if (this.content.enableScrollListener && this.scrollBackwards) {
      this.content.enableScrollListener();
    }
  }

  init() {
    const params = this.params;
    // console.log(params);
    this._d = params.get('options');
    //console.log(`lang: ${this._d.lang}`);
    this.translate.use(this._d.lang);
    this.fns = fns;
    
    let startTime = moment(this._d.from).valueOf();
    let endTime = moment(this._d.to).valueOf();
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
      this.createYearPicker(startTime, endTime)
    } else {
      this.calendarMonths = this.calSvc.createMonthsByPeriod(
          startTime,
          this.findInitMonthNumber(this.defaultDate) + this.countNextMonths,
          this._d);
    }
  }

  findCssClass() {
    let cssClass = this.params.get('cssClass');

    if (cssClass) {
      cssClass.split(' ').forEach((cssClass: string) => {
        if (cssClass.trim() !== '')
          this._renderer.setElementClass(
              this._elementRef.nativeElement, cssClass, true);
      });
    }
  }

  onChange(data: any) {
    // this.calSvc.savedHistory(data, this._id);
    this.ref.detectChanges();
  }

  selectMonthHandler(data: Date) {
    let monthStartDate: Date = fns.startOfMonth(data);
    let monthEndDate: Date = fns.endOfMonth(data);
    if (fns.isAfter(monthEndDate, this._d.to)) {
      monthEndDate = this._d.to;
    }
    
    if (fns.isBefore(monthStartDate, this._d.from)) {
      monthStartDate = this._d.from;
    }

    this.dayTemp[0] = this.calSvc.createCalendarDayForMonth(monthStartDate);
    this.dayTemp[1] = this.calSvc.createCalendarDayForMonth(monthEndDate);
  }

  selectHandler(month: CalendarMonth, date: CalendarDay, mode: string) {
    let endOfday = fns.toDate(date.time);
    let startOfday = mode === 'week' ? fns.addDays(fns.subWeeks(endOfday, 1), 1) :
                                       fns.subMonths(endOfday, 1);
    if (fns.isBefore(startOfday, this._d.from)) {
      startOfday = fns.toDate(this._d.from);
    }
    // let endOfday = mode === "week" ? fns.endOfISOWeek(date.time):
    // fns.endOfMonth(date.time);
    // console.log('--------------- before ----------------');
    console.log(`FromDate: ${this._d.from}`);
    console.log(`ToDate: ${this._d.to}`);
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
    for (let i = 0; i < month.days.length; i++) {
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
      let monthIndex = this.calendarMonths.indexOf(month);
      if (monthIndex >= 1) {
        let prevMonth = this.calendarMonths[monthIndex - 1];
        for (let i = 0; i < prevMonth.days.length; i++) {
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
      } else {
        console.error('month index out of bound');
      }
    }

    if (this.dayTemp[1] === null) {
      let monthIndex = this.calendarMonths.indexOf(month);
      if (monthIndex < this.calendarMonths.length - 1) {
        let nextMonth = this.calendarMonths[monthIndex + 1];
        for (let i = 0; i < nextMonth.days.length; i++) {
          if (nextMonth.days[i] != null) {
            if (fns.isSameDay(endOfday, nextMonth.days[i].time)) {
              this.dayTemp[1] = nextMonth.days[i];
              this.dayTemp[1].selected = true;
              break;
            }
          }
        }
      } else {
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
  }


  onSelectDate(selected: {month: CalendarMonth, date: CalendarDay}) {
    let month: CalendarMonth = selected.month;
    let date: CalendarDay = selected.date;
    console.log('selected: ' + fns.toDate(date.time));
    if (this.mode === 'week' || this.mode === 'month') {
      this.selectHandler(month, date, this.mode);
    } else {
      console.error('unsupported selection mode');
    }
  }

  onCancel() { this.viewCtrl.dismiss(); }

  pad(n: number) {
      return (n < 10) ? ("0" + n) : n;
  }
  dateToString(convertDay: number, today: Date): string {
    let date: Date = fns.toDate(convertDay);
    let yearOfDate = fns.getISOYear(date);
    let monthOfDate = this.pad(fns.getMonth(date) + 1);
    let dayOfDate = this.pad(fns.getDate(date));
    let hoursOfDate = this.pad(fns.getHours(today));
    let minutesOfDate = this.pad(fns.getMinutes(today));
    let secondsOfDate = this.pad(fns.getSeconds(today));
    return `${yearOfDate}-${monthOfDate}-${dayOfDate} ${hoursOfDate}:${minutesOfDate}:${secondsOfDate} GMT`;
  }

  done() {
    // let from = fns.toDate(this.dayTemp[0].time);
    // let fromYear = fns.getISOYear(from);
    // let fromMonth = fns.getMonth(from);
    // let fromDay = fns.getDate(from);
    // let to = fns.toDate(this.dayTemp[1].time); 
    // let toYear = fns.getISOYear(from);
    let date = new Date();
    let today = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    //console.log(`from: ${from}, to: ${to}, current: ${current}`);
    // this.viewCtrl.dismiss({
    //   from: this.dateToString(this.dayTemp[0].time, today),
    //   to: this.dateToString(this.dayTemp[1].time, today)
    // }); 
    let result: Array<string> = [];
    if (this.dayTemp[0]!== null) {
      result.push(this.dateToString(this.dayTemp[0].time, today));
    }
    if (this.dayTemp[1]!== null) {
      result.push(this.dateToString(this.dayTemp[1].time, today));
    }
    this.viewCtrl.dismiss(result);
  }

  canDone(): boolean {
    if (!Array.isArray(this.dayTemp)) {
      return false
    }

    if (this._d.isRadio) {
      return !!(this.dayTemp[0] && this.dayTemp[0].time);
    } else {
      return !!(this.dayTemp[0] && this.dayTemp[1]) &&
          !!(this.dayTemp[0].time && this.dayTemp[1].time);
    }
  }

  getHistory() {
    if (this.isSaveHistory) {
      this.dayTemp = this.calSvc.getHistory(this._id);
    }
  }

  createYearPicker(startTime: number, endTime: number) {
    // init year array
    this.years = [];
    // getting max and be sure, it is in future (maybe parameter?)
    let maxYear = (new Date(endTime)).getFullYear();

    if (maxYear <= 1970) {
      maxYear = (new Date(this.defaultDate)).getFullYear() + 10;
      this.options.end = new Date(maxYear, 12, 0).getTime();
    }

    // min year should be okay, either it will be set or something like 1970 at
    // min
    let minYear = (new Date(startTime)).getFullYear();

    // calculating the needed years to be added to array
    let neededYears = (maxYear - minYear);

    // pushing years to selection array
    for (let y = 0; y <= neededYears; y++) {
      this.years.push(maxYear - y);
    }

    this.years.reverse();
    // selection-start-year of defaultDate
    this.year = this.defaultDate.getFullYear();
    let firstDayOfYear = new Date(this.year, 0, 1);
    let lastDayOfYear = new Date(this.year, 12, 0);

    // don't calc over the start / end
    if (firstDayOfYear.getTime() < this.options.start) {
      firstDayOfYear = new Date(this.options.start);
    }

    if (lastDayOfYear.getTime() > this.options.end) {
      lastDayOfYear = new Date(this.options.end);
    }
    // calcing the month
    this.calendarMonths = this.calSvc.createMonthsByPeriod(
        firstDayOfYear.getTime(),
        this.findInitMonthNumber(this.defaultDate) + this.countNextMonths,
        this._d);
    // sets the range new

    // checking whether the start is after firstDayOfYear
    this.options.range_beg = firstDayOfYear.getTime() < startTime ?
        startTime :
        firstDayOfYear.getTime();
    // checking whether the end is before lastDayOfYear
    this.options.range_end =
        lastDayOfYear.getTime() > endTime ? endTime : lastDayOfYear.getTime();
  }


  nextMonth(infiniteScroll: InfiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    let len = this.calendarMonths.length;
    let final = this.calendarMonths[len - 1];
    let nextTime = moment(final.original.time).add(1, 'M').valueOf();
    let rangeEnd = this.options.range_end ?
        moment(this.options.range_end).subtract(1, 'M') :
        0;

    if (len <= 0 ||
        (rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd))) {
      infiniteScroll.enable(false);
      return;
    }

    this.calendarMonths.push(
        ...this.calSvc.createMonthsByPeriod(nextTime, 1, this._d));
    infiniteScroll.complete();
  }

  backwardsMonth() {
    let first = this.calendarMonths[0];
    let firstTime = moment(first.original.time).subtract(1, 'M').valueOf();
    // console.log("range_beg: " + fns.toDate(this.options.range_beg));
    // console.log("range_end: " + fns.toDate(this.options.range_end));
    // console.log("firstTime: " + fns.toDate(firstTime));
    if (fns.isSameMonth(firstTime, this._d.from) ||
        (fns.isAfter(firstTime, this._d.from) &&
         fns.isBefore(firstTime, this._d.to))) {
      console.log('unshift begin!!!');
      this.calendarMonths.unshift(
          ...this.calSvc.createMonthsByPeriod(firstTime, 1, this._d));
      this.ref.detectChanges();
    }
  }

  scrollToDefaultDate() {
    let defaultDateIndex = this.findInitMonthNumber(this.defaultDate);
    let defaultDateMonth =
        this.monthsEle.nativeElement.children[`month-${defaultDateIndex}`]
            .offsetTop;

    if (defaultDateIndex === 0 || defaultDateMonth === 0) return;
    setTimeout(() => { this.content.scrollTo(0, defaultDateMonth, 128); }, 200)
  }

  onScroll($event: any) {
    if (!this.scrollBackwards) return;
    if ($event.scrollTop <= 200 && this._s) {
      this._s = !1;
      let lastHeight = this.content.getContentDimensions().scrollHeight;
      setTimeout(() => {
        this.backwardsMonth();
        let nowHeight = this.content.getContentDimensions().scrollHeight;
        if (nowHeight - lastHeight >= 5) {
          this.content.scrollTo(0, nowHeight - lastHeight, 0).then(() => {
            this._s = !0;
          })
        }
      }, 300);
    }
  }

  /**
   *
   *
   * @param {Date} date
   * @returns {number}
   * @memberof CalendarComponent
   */
  findInitMonthNumber(date: Date): number {
    let startDate = moment(this.options.start);
    let defaultDate = moment(date);
    const isAfter: boolean = defaultDate.isAfter(startDate);
    if (!isAfter) return 0;

    if (this.showYearPicker) {
      startDate = moment(new Date(this.year, 0, 1));
    }


    return defaultDate.diff(startDate, 'month');
  }

  changedYearSelection() {
    // re-enabling infinite scroll
    if (this.infiniteScroll !== undefined) {
      this.infiniteScroll.enable(true);
    }
    // getting first day and last day of the year
    let firstDayOfYear = new Date(this.year, 0, 1);
    let lastDayOfYear = new Date(this.year, 12, 0);
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
    let monthCount =
        (this.findInitMonthNumber(firstDayOfYear) + this.countNextMonths);
    // this.calendarMonths = this.calSvc.createMonthsByPeriod(
    //     firstDayOfYear.getTime(), monthCount <= 1 ? 3 : monthCount, this._d);
    // scrolling to the top
    // setTimeout(() => { this.content.scrollTo(0, 0, 128); }, 300);


    let monthOfLastDay = fns.startOfMonth(new Date(lastDayOfYear));
    let monthOfFirstDay = fns.startOfMonth(new Date(firstDayOfYear));
    let currentFirstMonth =
        fns.startOfMonth(this.calendarMonths[0].original.time);
    console.log(
        `currentFirstMonth: ${currentFirstMonth}, monthOfFirstDay: ${monthOfFirstDay}, monthOfLastDay: ${monthOfLastDay}`);
    if (!(fns.isSameMonth(currentFirstMonth, monthOfFirstDay) ||
          fns.isBefore(currentFirstMonth, monthOfFirstDay))) {
      // insert needed month
      let diffMonths =
          fns.differenceInCalendarMonths(currentFirstMonth, monthOfFirstDay);
      this.calendarMonths.unshift(...this.calSvc.createMonthsByPeriod(
          firstDayOfYear.getTime(), diffMonths, this._d));
      setTimeout(() => { this.content.scrollTo(0, 0, 128); }, 200);
    } else {
      // search and scroll to date
      let i: number;
      for (i = 0; i < this.calendarMonths.length; i++) {
        if (fns.isSameMonth(
                monthOfFirstDay, this.calendarMonths[i].original.time)) {
          break;
        }
      }

      if (i != this.calendarMonths.length) {
        let defaultDateMonth =
            this.monthsEle.nativeElement.children[`month-${i}`].offsetTop;
        // if (i === 0 || defaultDateMonth === 0) return;
        setTimeout(
            () => { this.content.scrollTo(0, defaultDateMonth, 128); }, 200);
      } else {
        console.error('changedYearSelection(): index out of bound');
      }
    }
  }
}
