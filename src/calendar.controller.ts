import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ModalOptions, CalendarControllerOptions } from './calendar.model'
import { CalendarComponent } from "./components/calendar-component";
import * as fns from 'date-fns';

@Injectable()
export class CalendarController {

    isRadio: boolean;
    constructor(
        public modalCtrl: ModalController) { }

    openCalendar(calendarOptions: CalendarControllerOptions, modalOptions:ModalOptions = {}):any {

        let _arr:Array<any> = [];
        let cur = new Date();


        let {
            lang = 'en',
            mode = 'day',
            from = fns.subYears(cur, 2),
            to = cur,
            cssClass = '',
            weekStartDay = 0,
            isRadio = true,
            canBackwardsSelected = true,
            disableWeekdays = _arr,
            closeLabel = 'Cancel',
            closeIcon = false,
            id = '',
            isSaveHistory = false,
            monthTitle = 'MMM yyyy',
            title = 'Calendar',
            weekdaysTitle = "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            daysConfig = _arr,
            countNextMonths = 1,
            showYearPicker = true,
        } = calendarOptions || {};

        let options: CalendarControllerOptions = {
            lang: lang,
            mode: mode,
            from:from,
            to:to,
            cssClass:cssClass,
            isRadio: mode === 'day',
            weekStartDay:weekStartDay,
            canBackwardsSelected:canBackwardsSelected,
            closeLabel:closeLabel,
            closeIcon:closeIcon,
            id:id,
            isSaveHistory:isSaveHistory,
            defaultDate:calendarOptions.defaultDate || to ,
            disableWeekdays:disableWeekdays,
            monthTitle:monthTitle,
            title:`Mode: By ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
            weekdaysTitle:weekdaysTitle,
            daysConfig:daysConfig,
            countNextMonths:countNextMonths,
            showYearPicker: mode === 'day' || mode === 'week'|| mode === 'custom',
        };

        let calendarModal = this.modalCtrl.create(CalendarComponent, Object.assign({
            options:options,
        },options),modalOptions);

        calendarModal.present();

        return new Promise( (resolve, reject) => {

            calendarModal.onWillDismiss((data:any)=> {
                let result: {
                    date?: any;
                    from?: any;
                    to?: any;
                } = {};
                if(data && Array.isArray(data)){
                    if(options.isRadio){
                        result.date = data[0];
                    }else {
                        result.from = data[0];
                        result.to = data[1];
                    }
                    resolve(result);
                } else {
                    reject('cancelled');
                }
            });
        });


    }

    setHistory(param: any) {
        localStorage.setItem(`ion-calendar-${param.id}`, JSON.stringify(param));
    }

    getHistory(id: any): Object {
        let _history = localStorage.getItem(`ion-calendar-${id}`);
        if(_history){
            return JSON.parse(_history);
        }
    }

    removeHistory(id:any) {
        localStorage.removeItem(`ion-calendar-${id}`)
    }
}
