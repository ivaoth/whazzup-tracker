import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { FloatPipe } from './float.pipe';
import { ValidatePipe } from './validate.pipe';
import { TrackerLinkPipe } from './tracker-link.pipe';
import { EVENT_DATE } from './event-date';
import { ClientByIdPipe } from './client-by-id.pipe';


const getEventDateFromPrompt = () => {
  const currentEventDate = localStorage.getItem('eventDate');
  const eventDate = prompt('Enter Event Date', currentEventDate);
  localStorage.setItem('eventDate', eventDate);
  return eventDate;
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    FloatPipe,
    ValidatePipe,
    TrackerLinkPipe,
    ClientByIdPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    DataService,
    {
      provide: EVENT_DATE,
      useFactory: getEventDateFromPrompt
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
