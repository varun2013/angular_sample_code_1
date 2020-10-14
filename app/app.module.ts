import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppService } from './app.service'
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SearchComponent } from './layout/header/search/search.component';
import { LogoComponent } from './layout/header/logo/logo.component';
import { NavigationTriggerComponent } from './layout/header/navigation-trigger/navigation-trigger.component';
import { UserComponent } from './layout/sidebar/user/user.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';

import { Layout1Component } from './layout/layouts/layout-1/layout.component';
import { Layout2Component } from './layout/layouts/layout-2/layout.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { LoaderComponent } from './layout/layouts/loader/loader.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthUserService } from './guards/auth-user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/AuthInterceptor';
import { SharedModule } from './shared/shared.module'

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
        Layout1Component,
        Layout2Component,
        SearchComponent,
        LogoComponent,
        NavigationTriggerComponent,
        UserComponent,
        PageLoaderComponent,
        LoaderComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        NgScrollbarModule,
        BsDropdownModule.forRoot(),
        ButtonsModule.forRoot(),
        CoreModule,
        NgxSpinnerModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [
        AppService, 
        AuthUserService,{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
