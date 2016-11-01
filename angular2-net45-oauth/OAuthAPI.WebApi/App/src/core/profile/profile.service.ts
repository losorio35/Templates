import { Injectable, OnInit } from '@angular/core';
import { TokenStorageService } from "../auth/token-storage.service";
import { Observable } from "rxjs";
import {AppState} from '../../app/app-store';
import {Store} from '@ngrx/store';
import {ProfileModel} from '../models/profile-model';
import { Storage } from '../storage'

@Injectable()
export class ProfileService{
    constructor(private storage: Storage,
                private store: Store<AppState>
    ){    }

    isEmailConfirmed(): Observable<boolean>{
        //TODO: fix this sill serilization bug
        return this.store.select( state => state.profile.email_confirmed)
            .map(emailConfirmed => emailConfirmed.toString() == "True");

    }

    isInRole(role: string): Observable<boolean>{
        return this.store.select( state => state.profile.roles)
            .map( roles => roles.indexOf(role, 0) > -1 )
    }

    storeProfile(profile: ProfileModel){
        this.storage.setItem('profile', profile);
        this.store.dispatch({type: "STORE_PROFILE", payload: profile});
    }

}