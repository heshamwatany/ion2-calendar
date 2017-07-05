import { OnInit, EventEmitter } from '@angular/core';
export declare class MonthPickComponent implements OnInit {
    year: number;
    month: number;
    today: Date;
    onSelectMonth: EventEmitter<any>;
    monthLabels: Array<string>;
    selectedIndex: number;
    selectedYear: number;
    constructor();
    ngOnInit(): void;
    prevYear(): void;
    nextYear(): void;
    shouldForwardDisabled(): boolean;
    shouldBackwardDisabled(): boolean;
    onChange(data: any): void;
    isDisabled(index: number): boolean;
    isChecked(index: number): boolean;
}
