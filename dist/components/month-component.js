import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export var MONTH_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MonthComponent; }),
    multi: true,
};
export var MonthComponent = (function () {
    function MonthComponent(ref) {
        this.ref = ref;
        this.onChange = new EventEmitter();
        this.onSelectDate = new EventEmitter();
        this._date = [null, null];
    }
    MonthComponent.prototype.ngOnInit = function () { this._date = [null, null]; };
    MonthComponent.prototype.writeValue = function (obj) { this._date = obj; };
    MonthComponent.prototype.registerOnChange = function (fn) { this._onChanged = fn; };
    MonthComponent.prototype.registerOnTouched = function (fn) { this._onTouched = fn; };
    MonthComponent.prototype.isEndSelection = function (day) {
        if (this.isRadio || !Array.isArray(this._date) || this._date[1] === null) {
            return false;
        }
        return this._date[1].time === day.time;
    };
    MonthComponent.prototype.isBetween = function (day) {
        if (this.isRadio || !Array.isArray(this._date)) {
            return false;
        }
        var start = 0;
        var end = 0;
        if (this._date[0] === null) {
            return false;
        }
        else {
            start = this._date[0].time;
        }
        if (this._date[1] === null) {
            return false;
        }
        else {
            end = this._date[1].time;
        }
        return day.time < end && day.time > start;
    };
    MonthComponent.prototype.isStartSelection = function (day) {
        if (this.isRadio || !Array.isArray(this._date) || this._date[0] === null) {
            return false;
        }
        return this._date[0].time === day.time && this._date[1] !== null;
    };
    MonthComponent.prototype.isSelected = function (time) {
        if (Array.isArray(this._date)) {
            if (this._date[0] !== null) {
                return time === this._date[0].time;
            }
            if (this._date[1] !== null) {
                return time === this._date[1].time;
            }
        }
        else {
            return false;
        }
    };
    MonthComponent.prototype.onSelected = function (item) {
        this.ref.detectChanges();
        if (this.mode === 'custom') {
            if (this._date[0] === null) {
                this._date[0] = item;
            }
            else if (this._date[1] === null) {
                if (this._date[0].time < item.time) {
                    this._date[1] = item;
                }
                else if (this._date[0].time > item.time) {
                    this._date[1] = this._date[0];
                    this._date[0] = item;
                }
            }
            else {
                this._date[0].selected = false;
                this._date[1].selected = false;
                this.ref.detectChanges();
                this._date[0] = item;
                this._date[1] = null;
            }
            this.ref.detectChanges();
        }
        else if (this.isRadio) {
            item.selected = true;
            if (this._date[0] !== null) {
                this._date[0].selected = false;
            }
            this._date[0] = item;
            this.onChange.emit(this._date);
        }
        else {
            this.onSelectDate.emit({ month: this.month, date: item });
        }
        // if(this._date[0] === null) {
        //     this._date[0] = item;
        //     this.ref.detectChanges();
        // }else if(this._date[1] === null) {
        //     if(this._date[0].time < item.time){
        //         this._date[1] = item;
        //     }else {
        //         this._date[1] = this._date[0];
        //         this._date[0] = item;
        //     }
        //     this.ref.detectChanges();
        // }else {
        //     this._date[0] = item;
        //     this._date[1] = null;
        // }
        // this.onChange.emit(this._date);
        this.ref.detectChanges();
    };
    MonthComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ion2-month',
                    providers: [MONTH_VALUE_ACCESSOR],
                    template: "        \n        <div *ngIf=\"isRadio\">\n            <div class=\"days-box\">\n                <div class=\"days\" *ngFor=\"let day of month.days\">\n                    <button [class]=\"'days-btn ' + day.cssClass\"\n                            *ngIf=\"day\"\n                            [class.today]=\"day.isToday\"\n                            (click)=\"onSelected(day)\"\n                            [class.marked]=\"day.marked\"\n                            [class.on-selected]=\"isSelected(day.time)\"\n                            [disabled]=\"day.disable\">\n                        <p>{{day.title}}</p>\n                        <small *ngIf=\"day.subTitle\">{{day?.subTitle}}</small>\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div *ngIf=\"!isRadio\">\n            <div class=\"days-box\">\n                <div class=\"days\" *ngFor=\"let day of month.days\">\n                    <button [class]=\"'days-btn ' + day.cssClass\"\n                            *ngIf=\"day\"\n                            [class.today]=\"day.isToday\"\n                            (click)=\"onSelected(day)\"\n                            [class.marked]=\"day.marked\"\n                            [class.on-selected]=\"isSelected(day.time)\"\n                            [disabled]=\"day.disable\"\n                            [class.startSelection]=\"isStartSelection(day)\"\n                            [class.endSelection]=\"isEndSelection(day)\"\n                            [class.between]=\"isBetween(day)\">\n                        <p>{{day.title}}</p>\n                        <small *ngIf=\"day.subTitle\">{{day?.subTitle}}</small>\n                    </button>\n                </div>\n            </div>\n        </div>\n    ",
                },] },
    ];
    /** @nocollapse */
    MonthComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    MonthComponent.propDecorators = {
        'month': [{ type: Input },],
        'isRadio': [{ type: Input },],
        'isSaveHistory': [{ type: Input },],
        'id': [{ type: Input },],
        'mode': [{ type: Input },],
        'onChange': [{ type: Output },],
        'onSelectDate': [{ type: Output },],
    };
    return MonthComponent;
}());
//# sourceMappingURL=month-component.js.map