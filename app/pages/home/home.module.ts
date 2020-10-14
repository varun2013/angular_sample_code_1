import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from "@angular/router";
import { MessageListingComponent } from './message-listing/message-listing.component';
import { DraftListingComponent } from './draft-listing/draft-listing.component';
import { SharedModule } from '../../shared/shared.module';
import { ComposeModalComponent } from './compose-modal/compose-modal.component';
import { SettingsComponent } from './settings/settings.component';
import { WelcomeModalComponent } from './welcome-modal/welcome-modal.component';

const HOME_ROUTE = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [
    HomeComponent,
    MessageListingComponent,
    DraftListingComponent,
    ComposeModalComponent,
    SettingsComponent,
    WelcomeModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(HOME_ROUTE)
  ],
  entryComponents: [
    ComposeModalComponent,
    WelcomeModalComponent
  ]
})
export class HomeModule { }
