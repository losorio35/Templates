import { Injectable } from '@angular/core';
import {RegisterModel} from '../../+auth/models/register-model';
import {Observable} from 'rxjs';
import {Response, Http} from '@angular/http';
import {LoadingBarService} from '../services/loading-bar.service';
import {HttpExceptionService} from '../services/http-exceptions.service';
import {LoginModel} from '../../+auth/models/login-model';
import {TokenService} from './token.service';
import {AuthApiService} from '../services/auth-api.service';
import {AuthActions} from './auth.store';
import {TokenActions} from './token.store';
import {ProfileActions} from '../profile/profile.store';
import {ChangePasswordModel} from '../models/change-password';
import {ResetPasswordModel} from '../models/ResetPasswordModel';

@Injectable()
export class AccountService {

    constructor(private loadingBar: LoadingBarService,
                private http: Http,
                private httpExceptions: HttpExceptionService,
                private tokens: TokenService,
                private authApi: AuthApiService,
                private authActions: AuthActions,
                private tokenActions: TokenActions,
                private profileActions: ProfileActions
    ) { }

    register(data: RegisterModel): Observable<Response> {
        return this.http.post("api/account/create", data)
            .map(res => res)
            .catch( this.httpExceptions.handleError )
    }

    login(user: LoginModel)  {
        return this.tokens.getTokens(user, "password")
            .do(res => this.tokens.scheduleRefresh() )
    }

    sendForgotPassword( data ){
        return this.authApi.post("/account/SendForgotPassword", data)
    }

    changePassword(data: ChangePasswordModel){
        return this.authApi.post("/account/changePassword", data)
    }

    resetPassword(data: ResetPasswordModel){
        return this.authApi.post("/account/resetPassword", data )

    }

    logout(){
        this.tokens.deleteTokens();
        this.tokens.unsubscribeRefresh();

        this.authActions.isNotLoggedIn();
        this.tokenActions.deleteTokens();
        this.profileActions.deleteProfile();
    }

}