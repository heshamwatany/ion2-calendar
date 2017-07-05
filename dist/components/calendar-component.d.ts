import { ChangeDetectorRef, ElementRef, Renderer } from '@angular/core';
import { Content, InfiniteScroll, NavParams, ViewController } from 'ionic-angular';
import { CalendarControllerOptions, CalendarDay, CalendarMonth, CalendarOptions } from '../calendar.model';
import { CalendarService } from '../services/calendar.service';
import { TranslateService } from '@ngx-translate/core';
export declare class CalendarComponent {
    private _renderer;
    _elementRef: ElementRef;
    params: NavParams;
    viewCtrl: ViewController;
    ref: ChangeDetectorRef;
    calSvc: CalendarService;
    translate: TranslateService;
    content: Content;
    monthsEle: ElementRef;
    title: string;
    closeLabel: string;
    dayTemp: Array<CalendarDay | null>;
    calendarMonths: Array<CalendarMonth>;
    monthTitleFilterStr: string;
    weekdaysTitle: Array<string>;
    defaultDate: Date;
    scrollBackwards: boolean;
    weekStartDay: number;
    isSaveHistory: boolean;
    countNextMonths: number;
    showYearPicker: boolean;
    year: number;
    years: Array<number>;
    infiniteScroll: InfiniteScroll;
    closeIcon: boolean;
    options: CalendarOptions;
    fns: any;
    debug: boolean;
    _s: boolean;
    _id: string;
    _color: string;
    _d: CalendarControllerOptions;
    mode: string;
    constructor(_renderer: Renderer, _elementRef: ElementRef, params: NavParams, viewCtrl: ViewController, ref: ChangeDetectorRef, calSvc: CalendarService, translate: TranslateService);
    ionViewDidLoad(): void;
    init(): void;
    findCssClass(): void;
    onChange(data: any): void;
    selectMonthHandler(data: Date): void;
    selectHandler(month: CalendarMonth, date: CalendarDay, mode: string): void;
    onSelectDate(selected: {
        month: CalendarMonth;
        date: CalendarDay;
    }): void;
    onCancel(): void;
    pad(n: number): string | number;
    dateToString(convertDay: number, today: Date): string;
    done(): void;
    canDone(): boolean;
    getHistory(): void;
    createYearPicker(startTime: number, endTime: number): void;
    nextMonth(infiniteScroll: InfiniteScroll): void;
    backwardsMonth(): void;
    scrollToDefaultDate(): void;
    onScroll($event: any): void;
    /**
     *
     *
     * @param {Date} date
     * @returns {number}
     * @memberof CalendarComponent
     */
    findInitMonthNumber(date: Date): number;
    changedYearSelection(): void;
}
