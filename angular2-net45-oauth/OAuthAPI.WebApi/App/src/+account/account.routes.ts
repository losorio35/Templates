import {Routes, RouterModule} from "@angular/router";
import {AuthenticatedAuthGuard} from "../core/guards/authenticated-auth-guard.service";
import {ModuleWithProviders} from "@angular/core";
import {AccountComponent} from "./account.component";
/**
 * Created by Fabian on 25/10/2016.
 */

const accountRoutes: Routes = [
    {
        path: '',
        component: AccountComponent,
        canActivate: [AuthenticatedAuthGuard],
        children: [
            // {
            //     path: '',
            //     component: RolesComponent
            // },

        ]
    }
];



export const accountRouting: ModuleWithProviders = RouterModule.forChild(accountRoutes);