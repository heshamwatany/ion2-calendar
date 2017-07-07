import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as fns from 'date-fns';
export var MonthPickComponent = (function () {
    function MonthPickComponent() {
        this.onSelectMonth = new EventEmitter();
        this.monthLabels = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        //this.reset = false;
        this.selectedIndex = -1;
    }
    MonthPickComponent.prototype.ngOnInit = function () {
        this.year = fns.getISOYear(this.today);
    };
    MonthPickComponent.prototype.prevYear = function () {
        //this.reset = false;
        this.year -= 1;
    };
    MonthPickComponent.prototype.nextYear = function () {
        //this.reset = false;
        this.year += 1;
    };
    MonthPickComponent.prototype.shouldForwardDisabled = function () {
        if (this.year >= fns.getISOYear(this.today)) {
            return true;
        }
        return false;
    };
    MonthPickComponent.prototype.shouldBackwardDisabled = function () {
        if (this.year <= (fns.getISOYear(this.today) - 2)) {
            return true;
        }
        return false;
    };
    MonthPickComponent.prototype.onChange = function (data) {
        console.log(data);
        //this.reset = true;
        this.selectedIndex = this.monthLabels.indexOf(data);
        this.selectedYear = this.year;
        this.onSelectMonth.emit(new Date(this.year, this.selectedIndex));
    };
    MonthPickComponent.prototype.isDisabled = function (index) {
        var checkedDate = new Date(this.year, index);
        var twoYearBeforeToday = fns.subYears(this.today, 2);
        if ((!fns.isSameMonth(checkedDate, this.today)) && fns.isAfter(checkedDate, this.today)) {
            return true;
        }
        else if ((!fns.isSameMonth(checkedDate, twoYearBeforeToday)) && fns.isBefore(checkedDate, twoYearBeforeToday)) {
            return true;
        }
        return false;
    };
    MonthPickComponent.prototype.isChecked = function (index) {
        return this.selectedIndex === index && this.year === this.selectedYear;
    };
    MonthPickComponent.decorators = [
        { type: Component, args: [{
                    selector: 'monthpick',
                    template: "\n            <div class=\"row months-controls\">\n                <div class=\"arrow-left\" text-left>\n                    <button [disabled]=\"shouldBackwardDisabled()\" ion-button icon-only clear (click)=\"prevYear()\">\n                        <ion-icon name=\"arrow-back\"></ion-icon>\n                    </button>\n                </div>\n                <div text-center class=\"selectedYearsLabel\">\n                    <h2 class=\"selectedYearLabel\">{{ year }}</h2>\n                </div>\n                <div class=\"arrow-right\" text-right>\n                    <button [disabled]=\"shouldForwardDisabled()\" ion-button icon-only clear (click)=\"nextYear()\">\n                        <ion-icon name=\"arrow-forward\"></ion-icon>\n                    </button>\n                </div>\n            </div>\n            <ion-scroll scrollY=\"true\" style=\"width: 100%; height: 80%;\">\n                <ion-list radio-group (ionChange)=\"onChange($event)\">\n                    <ion-item *ngFor=\"let month of monthLabels; let i = index\">\n                        <ion-label>{{ month | translate }}</ion-label>\n                        <ion-radio value={{month}} [checked]=\"isChecked(i)\" [disabled] = \"isDisabled(i)\"></ion-radio>\n                    </ion-item>\n                </ion-list>\n            </ion-scroll>\n        ",
                    styles: ["\n    .months-controls ion-col[width-25] button {\n        margin-top: 25% !important;\n    }\n\n    .months-controls {\n        margin-top: 1.8rem;\n        font-size: 0;\n        display: flex;\n    }\n\n    .arrow-left {\n        width: 25% !important;\n        display: inline-block !important;\n    }\n\n    .arrow-right {\n        width: 25% !important;\n        display: inline-block !important;\n    }\n\n\n    button {\n        max-height: 32px;\n    }\n\n    .selectedYearsLabel {\n        width: 49% !important;\n        display: inline-block !important;\n        text-align: center;\n    }\n\n    .selectedYearLabel {\n        font-weight: bold;\n        text-align: center !important;\n    }\n\n    .month-cell {\n            border: 1px solid #ccc;\n            text-align: center;\n            padding: 10px;\n            min-height: 32px;\n    }\n\n    .row {\n        min-height: 40px;\n    }\n\n    .col {\n        padding: 0 0 0 0;\n    }\n\n    h2 {\n        margin-top: 0px;\n    }\n\n    .item-ios {\n        padding-left: 6% !important;\n        padding-right: 6% !important;\n    }\n\n    .item-ios.item-block .item-inner {\n        padding-right: 0px;\n    }\n    "]
                },] },
    ];
    /** @nocollapse */
    MonthPickComponent.ctorParameters = function () { return []; };
    MonthPickComponent.propDecorators = {
        'today': [{ type: Input },],
        'onSelectMonth': [{ type: Output },],
    };
    return MonthPickComponent;
}());
//# sourceMappingURL=monthpick-component.js.map