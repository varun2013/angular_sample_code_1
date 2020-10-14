import { Component, OnInit, Inject } from '@angular/core';



@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

    loginStats: any = {
        login: true,
        signUp: false,
        forgotPassword: false
    };

    toggleBlock(currentBlock, nextBlock) {
        this.loginStats[currentBlock] = false;
        this.loginStats[nextBlock] = true;
    };

    constructor() {

    }

    ngOnInit() {

    }


}
