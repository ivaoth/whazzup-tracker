import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { ValidatePipe } from './validate.pipe';
import { TrackerLinkPipe } from './tracker-link.pipe';
import { SessionDistancePipe } from './session-distance.pipe';
import { MultipleSessionDistancePipe } from './multiple-session-distance.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    ValidatePipe,
    TrackerLinkPipe,
    SessionDistancePipe,
    MultipleSessionDistancePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
