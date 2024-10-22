import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './Material.Module';
import { HomeComponent } from './components/home/home.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { ScheduleFormComponent } from './components/schedule-form/schedule-form.component';
import { StoreModule } from '@ngrx/store';
import { formReducer } from './services/store/Form/form.reducers';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VehicleFormComponent,
    ScheduleFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    StoreModule.forRoot({formState: formReducer}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [VehicleFormComponent, ScheduleFormComponent]
})
export class AppModule { }
