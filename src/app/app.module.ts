import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegistrationLayoutComponent } from './layouts/registration-layout/registration-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LeadLayoutComponent } from './layouts/lead-layout/lead-layout.component';

import { HttpRequestInterceptor } from './_helpers/http.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    RegistrationLayoutComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    LeadLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
