import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard:AuthGuard
  ) {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({

        email: ['', Validators.required],
        password: ['', Validators.required],

      });
  }

  onLoginSubmit(){
    const user = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    }

    //noinspection TypeScriptUnresolvedFunction
    this.authService.login(user).subscribe(data => {
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.storeUserDate(data.token, data.user);

        if(this.previousUrl){
          this.router.navigate([this.previousUrl]);
        }else{
          this.router.navigate(['/dashboard']);
        }

      }
    });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You need to signin first!';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}
