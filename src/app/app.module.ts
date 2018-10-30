import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { FloatPipe } from './float.pipe';
import { ValidatePipe } from './validate.pipe';
import { TrackerLinkPipe } from './tracker-link.pipe';

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
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAunCzIJDn_fcY_--Rfh5GWUVPOt8mM5fU',
    }),
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
