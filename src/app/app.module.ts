import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Routes , RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { GenderComponent } from './content/gender/gender.component';
import { NameComponent } from './content/name/name.component';
import { AgeComponent } from './content/age/age.component';
import { SizeComponent } from './content/size/size.component';
import { OccasionsComponent } from './content/occasions/occasions.component';
import { WeatherComponent } from './content/weather/weather.component';
import { ColorComponent } from './content/color/color.component';
import { PersonalityComponent } from './content/personality/personality.component';
import { ResultComponent } from './content/result/result.component';
import {DataService} from './services/data.service';

const appRoutes: Routes = [
  {path : '', redirectTo : 'gender', pathMatch : 'full'},
  {path : 'gender', component : GenderComponent, data : {title : 'Gender', depth : 1}},
  {path : 'name', component : NameComponent, data : {title : 'Name', depth : 2}},
  {path : 'age', component : AgeComponent, data : {title : 'Age', depth : 3}},
  {path : 'size', component : SizeComponent, data : {title : 'Size', depth : 4}},
  {path : 'occasions', component : OccasionsComponent, data : {title : 'Occasions', depth : 5}},
  {path : 'weather', component : WeatherComponent, data : {title : 'Weather', depth : 6}},
  {path : 'color', component : ColorComponent, data : {title : 'Color', depth : 7}},
  {path : 'personality', component : PersonalityComponent, data : {title : 'Personality', depth : 8}},
  {path : 'result', component : ResultComponent, data : {title : 'Result', depth : 9}},
]

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ContentComponent,
    GenderComponent,
    NameComponent,
    AgeComponent,
    SizeComponent,
    OccasionsComponent,
    WeatherComponent,
    ColorComponent,
    PersonalityComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
