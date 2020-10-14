import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {BsDropdownModule} from "ngx-bootstrap";
import {InputFloatModule} from "../../directive/input-float/input-float.module";

import {LoginComponent} from "./login.component";

const LOGIN_ROUTE = [{path: '', component: LoginComponent}];

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        BsDropdownModule.forRoot(),
        InputFloatModule,
        RouterModule.forChild(LOGIN_ROUTE)
    ]
})
export class LoginModule {
}
