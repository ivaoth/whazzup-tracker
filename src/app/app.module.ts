import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG, MapsAPILoader, LazyMapsAPILoader } from '@agm/core';

import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { FloatPipe } from './float.pipe';
import { ValidatePipe } from './validate.pipe';
import { TrackerLinkPipe } from './tracker-link.pipe';
import { BROWSER_GLOBALS_PROVIDERS } from '@agm/core/utils/browser-globals';
import { EVENT_DATE } from './event-date';

const getApiKeyFromPrompt = () => {
  const currentApiKey = localStorage.getItem('apiKey');
  const apiKey = prompt('Enter Google Maps API Key', currentApiKey);
  localStorage.setItem('apiKey', apiKey);
  return {
    apiKey
  };
};

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
    TrackerLinkPipe
  ],
  imports: [
    BrowserModule,
    AgmCoreModule,
    AppRoutingModule
  ],
  providers: [
    DataService,
    ...BROWSER_GLOBALS_PROVIDERS,
    {
      provide: MapsAPILoader,
      useClass: LazyMapsAPILoader
    },
    {
      provide: LAZY_MAPS_API_CONFIG,
      useFactory: getApiKeyFromPrompt
    },
    {
      provide: EVENT_DATE,
      useFactory: getEventDateFromPrompt
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
