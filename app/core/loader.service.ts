import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from '../layout/layouts/loader/loader';
@Injectable()
export class LoaderService {
    private loaderSubject = new Subject<LoaderState>();
    loaderState: any = this.loaderSubject.asObservable();
    constructor() { }
    show() {
        this.loaderSubject.next(<LoaderState>{ show: true });
    }
    hide() {
        this.loaderSubject.next(<LoaderState>{ show: false });

    }
}
