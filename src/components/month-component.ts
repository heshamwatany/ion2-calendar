import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';

import {CalendarDay, CalendarMonth} from '../calendar.model'

export const MONTH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MonthComponent),
  multi: true,
};

@Component({
  selector: 'ion2-month',
  providers: [MONTH_VALUE_ACCESSOR],
  template: `        
        <div *ngIf="isRadio">
            <div class="days-box">
                <div class="days" *ngFor="let day of month.days">
                    <button [class]="'days-btn ' + day.cssClass"
                            *ngIf="day"
                            [class.today]="day.isToday"
                            (click)="onSelected(day)"
                            [class.marked]="day.marked"
                            [class.on-selected]="isSelected(day.time)"
                            [disabled]="day.disable">
                        <p>{{day.title}}</p>
                        <small *ngIf="day.subTitle">{{day?.subTitle}}</small>
                    </button>
                </div>
            </div>
        </div>
        <div *ngIf="!isRadio">
            <div class="days-box">
                <div class="days" *ngFor="let day of month.days">
                    <button [class]="'days-btn ' + day.cssClass"
                            *ngIf="day"
                            [class.today]="day.isToday"
                            (click)="onSelected(day)"
                            [class.marked]="day.marked"
                            [class.on-selected]="isSelected(day.time)"
                            [disabled]="day.disable"
                            [class.startSelection]="isStartSelection(day)"
                            [class.endSelection]="isEndSelection(day)"
                            [class.between]="isBetween(day)">
                        <p>{{day.title}}</p>
                        <small *ngIf="day.subTitle">{{day?.subTitle}}</small>
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class MonthComponent implements ControlValueAccessor, OnInit {
  @Input() month: CalendarMonth;
  @Input() isRadio: boolean;
  @Input() isSaveHistory: boolean;
  @Input() id: any;
  @Input() mode: string;

  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSelectDate: EventEmitter<any> = new EventEmitter();
  _date: Array<CalendarDay|null> = [null, null];

  _onChanged: Function;
  _onTouched: Function;

  constructor(public ref: ChangeDetectorRef, ) {}

  ngOnInit() { this._date = [null, null]; }

  writeValue(obj: any): void { this._date = obj; }

  registerOnChange(fn: any): void { this._onChanged = fn; }

  registerOnTouched(fn: any): void { this._onTouched = fn; }

  isEndSelection(day: CalendarDay): boolean {
    if (this.isRadio || !Array.isArray(this._date) || this._date[1] === null) {
      return false;
    }

    return this._date[1].time === day.time;
  }

  isBetween(day: CalendarDay): boolean {
    if (this.isRadio || !Array.isArray(this._date)) {
      return false;
    }

    let start = 0;
    let end = 0;

    if (this._date[0] === null) {
      return false
    } else {
      start = this._date[0].time;
    }

    if (this._date[1] === null) {
      return false
    } else {
      end = this._date[1].time;
    }

    return day.time < end && day.time > start;
  }

  isStartSelection(day: CalendarDay): boolean {
    if (this.isRadio || !Array.isArray(this._date) || this._date[0] === null) {
      return false;
    }

    return this._date[0].time === day.time && this._date[1] !== null;
  }

  isSelected(time: number): boolean {
    if (Array.isArray(this._date)) {
      if (this._date[0] !== null) {
        return time === this._date[0].time;
      }

      if (this._date[1] !== null) {
        return time === this._date[1].time;
      }
    } else {
      return false;
    }
  }

  onSelected(item: any) {
    this.ref.detectChanges();
    if (this.mode === 'custom') {
      if (this._date[0] === null) {
        this._date[0] = item;
      } else if (this._date[1] === null) {
        if (this._date[0].time < item.time) {
          this._date[1] = item;
        } else if (this._date[0].time > item.time) {
          this._date[1] = this._date[0];
          this._date[0] = item;
        }
      } else {
        this._date[0].selected = false;
        this._date[1].selected = false;
        this.ref.detectChanges();
        this._date[0] = item;
        this._date[1] = null;
      }
      this.ref.detectChanges();
    } else if (this.isRadio) {
      item.selected = true;
      if (this._date[0] !== null) {
          this._date[0].selected = false;
      }
      this._date[0] = item;
      this.onChange.emit(this._date);
      // return;
    } else {
      this.onSelectDate.emit({month: this.month, date: item});
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
  }
}
