import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { CalendarComponent } from "./components/calendar-component";
import * as fns from 'date-fns';
export var CalendarController = (function () {
    function CalendarController(modalCtrl) {
        this.modalCtrl = modalCtrl;
    }
    CalendarController.prototype.openCalendar = function (calendarOptions, modalOptions) {
        if (modalOptions === void 0) { modalOptions = {}; }
        var _arr = [];
        var cur = new Date();
        var _a = calendarOptions || {}, _b = _a.lang, lang = _b === void 0 ? 'en' : _b, _c = _a.mode, mode = _c === void 0 ? 'day' : _c, _d = _a.from, from = _d === void 0 ? fns.subYears(cur, 2) : _d, _e = _a.to, to = _e === void 0 ? cur : _e, _f = _a.cssClass, cssClass = _f === void 0 ? '' : _f, _g = _a.weekStartDay, weekStartDay = _g === void 0 ? 0 : _g, _h = _a.isRadio, isRadio = _h === void 0 ? true : _h, _j = _a.canBackwardsSelected, canBackwardsSelected = _j === void 0 ? true : _j, _k = _a.disableWeekdays, disableWeekdays = _k === void 0 ? _arr : _k, _l = _a.closeLabel, closeLabel = _l === void 0 ? 'Cancel' : _l, _m = _a.closeIcon, closeIcon = _m === void 0 ? false : _m, _o = _a.id, id = _o === void 0 ? '' : _o, _p = _a.isSaveHistory, isSaveHistory = _p === void 0 ? false : _p, _q = _a.monthTitle, monthTitle = _q === void 0 ? 'MMM yyyy' : _q, _r = _a.title, title = _r === void 0 ? 'Calendar' : _r, _s = _a.weekdaysTitle, weekdaysTitle = _s === void 0 ? "Di_Lu_Ma_Me_Je_Ve_Sa".split("_") : _s, _t = _a.daysConfig, daysConfig = _t === void 0 ? _arr : _t, _u = _a.countNextMonths, countNextMonths = _u === void 0 ? 1 : _u, _v = _a.showYearPicker, showYearPicker = _v === void 0 ? true : _v;
        var options = {
            lang: lang,
            mode: mode,
            from: from,
            to: to,
            cssClass: cssClass,
            isRadio: mode === 'day',
            weekStartDay: weekStartDay,
            canBackwardsSelected: canBackwardsSelected,
            closeLabel: closeLabel,
            closeIcon: closeIcon,
            id: id,
            isSaveHistory: isSaveHistory,
            defaultDate: calendarOptions.defaultDate || to,
            disableWeekdays: disableWeekdays,
            monthTitle: monthTitle,
            title: "Mode: By " + (mode.charAt(0).toUpperCase() + mode.slice(1)),
            weekdaysTitle: weekdaysTitle,
            daysConfig: daysConfig,
            countNextMonths: countNextMonths,
            showYearPicker: mode === 'day' || mode === 'week' || mode === 'custom',
        };
        var calendarModal = this.modalCtrl.create(CalendarComponent, Object.assign({
            options: options,
        }, options), modalOptions);
        calendarModal.present();
        return new Promise(function (resolve, reject) {
            calendarModal.onWillDismiss(function (data) {
                var result = {};
                if (data && Array.isArray(data)) {
                    if (options.isRadio) {
                        result.date = data[0];
                    }
                    else {
                        result.from = data[0];
                        result.to = data[1];
                    }
                    resolve(result);
                }
                else {
                    reject('cancelled');
                }
            });
        });
    };
    CalendarController.prototype.setHistory = function (param) {
        localStorage.setItem("ion-calendar-" + param.id, JSON.stringify(param));
    };
    CalendarController.prototype.getHistory = function (id) {
        var _history = localStorage.getItem("ion-calendar-" + id);
        if (_history) {
            return JSON.parse(_history);
        }
    };
    CalendarController.prototype.removeHistory = function (id) {
        localStorage.removeItem("ion-calendar-" + id);
    };
    CalendarController.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CalendarController.ctorParameters = function () { return [
        { type: ModalController, },
    ]; };
    return CalendarController;
}());
//# sourceMappingURL=calendar.controller.js.map