/**
 * Created by hsuanlee on 2017/4/26.
 */
export interface CalendarOriginal {
    time: number;
    date: Date;
    year: number;
    month: number;
    firstWeek: number;
    howManyDays: number;
}

export interface CalendarDay {
    time: number;
    isToday: boolean;
    selected: boolean;
    disable: boolean;
    cssClass: string;
    title?: string;
    subTitle?: string;
    marked?: boolean;
    style?:{
        title?: string;
        subTitle?: string;
    }

}

export class CalendarMonth {
    original:CalendarOriginal;
    days: Array<CalendarDay>
}

export class DayConfig {
    date:Date;
    marked?:boolean;
    disable?:boolean;
    title?:string;
    subTitle?:string
}

export class CalendarOptions {
    start:number;
    end:number;
    isRadio:boolean;
    monthTitle:string;
    range_beg:number;
    range_end:number;
    daysConfig:Array<DayConfig>;
    disableWeekdays:Array<number>
}

export interface ModalOptions {
    showBackdrop?: boolean;
    enableBackdropDismiss?: boolean;
    enterAnimation?: string;
    leaveAnimation?: string;
}

export interface CalendarControllerOptions {
    lang?: string,
    mode?: string,
    from?:Date,
    cssClass?:string,
    to?:Date,
    isRadio?:boolean;
    id?:string;
    isSaveHistory?:boolean;
    weekStartDay?:number;
    disableWeekdays?:Array<number>,
    weekdaysTitle?:Array<string>,
    closeLabel?:string;
    closeIcon?:boolean;
    monthTitle?:string;
    canBackwardsSelected?:boolean;
    title?:string;
    defaultDate?:Date;
    countNextMonths?:number;
    showYearPicker?:boolean;
    daysConfig?:Array<{
        date:Date;
        cssClass?:string,
        marked?:boolean;
        title?:string;
        subTitle?:string;
    }>
}

