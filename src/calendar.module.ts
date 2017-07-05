import {Http} from '@angular/http';
import { CalendarComponent } from './components/calendar-component';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './services/calendar.service';
import { CalendarWeekComponent } from './components/calendar-week-component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MonthComponent } from './components/month-component';
import { MonthPickComponent } from './components/monthpick-component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/**
 * Created by youyou on 16/12/4.
 */


@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })],
  declarations: [CalendarComponent, CalendarWeekComponent, MonthComponent, MonthPickComponent],
  providers: [CalendarController, CalendarService],
  exports:[],
  entryComponents: [CalendarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarModule { }

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
