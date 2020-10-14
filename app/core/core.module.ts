import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RestService } from './rest.service';
import { NotificationService } from './notification.service'
import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataService } from './data.service';
import { LoaderService } from './loader.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
    imports: [
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        CommonModule
    ],
    providers: [
        RestService,
        NotificationService,
        DataService,
        LoaderService
    ],
    declarations: [
    ConfirmationModalComponent],
    exports: [
    ],
    entryComponents: [
        ConfirmationModalComponent
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
