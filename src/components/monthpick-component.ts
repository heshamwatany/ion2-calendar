import { CalendarDay } from './../calendar.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as fns from 'date-fns';

@Component({
    selector: 'monthpick',
    template: `
            <div class="row months-controls">
                <div class="col col-25" text-left>
                    <button [disabled]="shouldBackwardDisabled()" ion-button icon-only clear (click)="prevYear()">
                        <ion-icon name="arrow-back"></ion-icon>
                    </button>
                </div>
                <div text-center class="col col-50 selectedYearsLabel">
                    <h2 class="selectedYearLabel">{{ year }}</h2>
                </div>
                <div class="col col-25" text-right>
                    <button [disabled]="shouldForwardDisabled()" ion-button icon-only clear (click)="nextYear()">
                        <ion-icon name="arrow-forward"></ion-icon>
                    </button>
                </div>
            </div>
            <ion-scroll scrollY="true" style="width: 100%; height: 80%;">
                <ion-list radio-group (ionChange)="onChange($event)">
                    <ion-item *ngFor="let month of monthLabels; let i = index">
                        <ion-label>{{ month | translate }}</ion-label>
                        <ion-radio value={{month}} [checked]="isChecked(i)" [disabled] = "isDisabled(i)"></ion-radio>
                    </ion-item>
                </ion-list>
            </ion-scroll>
        `,
    styles: [`
    .months-controls ion-col[width-25] button {
        margin-top: 20% !important;
    }

    .months-controls {
        margin-top: 1.8rem;
    }

    button {
        max-height: 32px;
    }

    .selectedYearLabel {
        font-weight: bold;
    }

    .month-cell {
            border: 1px solid #ccc;
            text-align: center;
            padding: 10px;
            min-height: 32px;
    }

    .row {
        min-height: 40px;
    }

    .col {
        padding: 0 0 0 0;
    }

    h2 {
        margin-top: 0px;
    }

    .item-ios {
        padding-left: 6% !important;
        padding-right: 6% !important;
    }

    .item-ios.item-block .item-inner {
        padding-right: 0px;
    }
    `]
})
export class MonthPickComponent implements OnInit {
    year: number;
    month: number;
    @Input() today: Date;
    @Output() onSelectMonth: EventEmitter<any> = new EventEmitter();
    monthLabels: Array<string> = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
    
    //reset: boolean;
    selectedIndex: number;
    selectedYear: number;
    constructor() {
        //this.reset = false;
        this.selectedIndex = -1;
    }

    ngOnInit() {
      this.year = fns.getISOYear(this.today);
    }

    prevYear(): void {
        //this.reset = false;
        this.year -= 1;
    }

    nextYear(): void {
        //this.reset = false;
        this.year += 1;
    }

    shouldForwardDisabled(): boolean {
        if (this.year >= fns.getISOYear(this.today)) {
            return true;
        }
        return false;
    }

    shouldBackwardDisabled(): boolean {
        if (this.year <= (fns.getISOYear(this.today) - 2)) {
            return true;
        }
        return false;
    }

    onChange(data: any) {
        console.log(data);
        //this.reset = true;
        this.selectedIndex = this.monthLabels.indexOf(data);
        this.selectedYear = this.year;
        this.onSelectMonth.emit(new Date(this.year, this.selectedIndex));
    }

    isDisabled(index: number): boolean {
        let checkedDate: Date = new Date(this.year, index);
        let twoYearBeforeToday: Date = fns.subYears(this.today, 2);
        if ((!fns.isSameMonth(checkedDate, this.today)) && fns.isAfter(checkedDate, this.today)) {
            return true;
        } else if ((!fns.isSameMonth(checkedDate, twoYearBeforeToday)) && fns.isBefore(checkedDate, twoYearBeforeToday)) {
            return true;
        }
        return false;
    }

    isChecked(index: number): boolean {
        return this.selectedIndex === index && this.year === this.selectedYear;
    }
}