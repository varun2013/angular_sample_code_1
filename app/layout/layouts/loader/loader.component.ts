import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../core/loader.service';
import { LoaderState } from './loader';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
    selector: 'angular-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
    show = false;
    private subscription: Subscription;
    constructor(
        private loaderService: LoaderService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.subscription = this.loaderService.loaderState
            .subscribe((state: LoaderState) => {
                this.show = state.show;
                this.spinner.show();
            });

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}