//@angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//App
import { AppRoutingModule } from './app-routing.module';

//Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MeComponent } from './pages/me/me.component';
import { EventsComponent } from './pages/events/events.component';
import { CreateEventsComponent } from './pages/create-events/create-events.component';

//Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { AuthCardComponent } from './components/auth-card/auth-card.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventSectionComponent } from './components/event-section/event-section.component';


//Services
import AuthService from './services/auth-service';
import EventService from './services/event-service';

//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

//Swiper
import { SwiperModule } from 'swiper/angular';
import { EventFormComponent } from './components/event-form/event-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AuthCardComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    MeComponent,
    EventCardComponent,
    EventSectionComponent,
    EventsComponent,
    CreateEventsComponent,
    EventFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SwiperModule
  ],
  providers: [
    AuthService,
    EventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
