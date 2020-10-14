import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {NgScrollbarModule} from "ngx-scrollbar";
import {BsDropdownModule} from "ngx-bootstrap";

import {MessagesComponent} from "./messages.component";
import {SharedModule } from '../../shared/shared.module';

const MESSAGES_ROUTE = [{path: '', component: MessagesComponent}];

@NgModule({
    declarations: [MessagesComponent],
    imports: [
        CommonModule,
        NgScrollbarModule,
        BsDropdownModule.forRoot(),
        RouterModule.forChild(MESSAGES_ROUTE),
        SharedModule
    ]
})
export class MessagesModule {
}
