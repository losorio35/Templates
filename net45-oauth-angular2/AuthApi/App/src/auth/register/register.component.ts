import {Component, OnInit, Inject} from '@angular/core'
import { RegisterModel } from '../models/register-model'
import { FormGroup,    FormControl,    Validators,    FormBuilder }    from '@angular/forms';
import {AuthService} from "../auth.service";
import {ValidationService} from "../../app/validation/validation.service";
import {AlertComponent} from "../../app/alert/alert.component";
import {AlertService} from "../../app/alert/alert.service";

@Component({
    selector: 'register',
    templateUrl: './register.template.html'
})
export class RegisterComponent  implements OnInit {
   constructor(private formBuilder: FormBuilder,
               private authService: AuthService,
    private alertService: AlertService
   ) {   }
    registerForm: FormGroup;


    ngOnInit() {
           this.registerForm = this.formBuilder.group({
               userName: ['', [Validators.required, ValidationService.emailValidator]],
               passwords: this.formBuilder.group({
                   password: ['', [Validators.required, ValidationService.passwordValidator]],
                   confirmPassword: ['', [Validators.required, ValidationService.passwordValidator]]
               }, {validator: ValidationService.passwordComparisonValidator})
         });
    }


    onSubmit(){
        let data = Object.assign({}, this.registerForm.value, this.registerForm.value.passwords);
        //TODO: find better way to do this :/
        this.authService.register(data)
            .then( x => {
                    this.alertService.sendAlert("you won :D")
                    console.log(x)
                },
                x => {
                    console.log("error: " + x)
                }
            )
    };


}