import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  emailValid;
  emailMsg;
  usernameValid;
  usernameMsg;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private flashMsgModule: FlashMessagesService
  ) {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
        this.validUsernameChecker
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validEmailChecker
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
      cpassword: ['', Validators.compose([
        Validators.required,
      ])],
    },

      {validator: this.matchingPasswords('password', 'cpassword')}

    );
  }


  validEmailChecker(controls) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regExp = new RegExp(re);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return {validEmailChecker: true};
    }
  };


  validUsernameChecker(controls){
    var re2 = /^[a-zA-Z0-9]+$/;
    const regExp2 = new RegExp(re2);
    if(regExp2.test(controls.value)){
      return null;
    }else{
      return {validUsernameChecker: true};
    }
  };

  matchingPasswords(password, cpassword){
    return (group: FormGroup) => {
      if(group.controls[password].value === group.controls[cpassword].value){
        return null;
      }else{
        return {matchingPasswords: true};
      }
    }
  }


  clearForm(){
    this.form.reset();
  }


  onRegisterSubmit(){
    const user = {
      name: this.form.get('name').value,
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    }

    //noinspection TypeScriptUnresolvedFunction
    this.authService.registerUser(user).subscribe(data => {
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.clearForm();
        this.flashMsgModule.show("Registration Successful!", {cssClass: 'alert-success'});
        this.router.navigate(['/login'])
      }
    });

  }



  //Real Time functions that check availability of username and email

  checkEmail(){

    var email = this.form.get('email').value;
    //noinspection TypeScriptUnresolvedVariable
    if(email && !this.form.controls.email.invalid){
      //noinspection TypeScriptUnresolvedFunction
      this.authService.checkEmail(email).subscribe(data => {
        if(!data.success){
          this.emailValid = false;
          this.emailMsg = data.message;
        }else{
          this.emailValid = true;
          this.emailMsg = data.message;
        }
      })
    }else{
      this.emailMsg = null;
    }
  }

  checkUsername(){

    var username = this.form.get('username').value;
    //noinspection TypeScriptUnresolvedVariable
    if(username && !this.form.controls.username.invalid){
      //noinspection TypeScriptUnresolvedFunction
      this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
        if(!data.success){
          this.usernameValid = false;
          this.usernameMsg = data.message;
        }else{
          this.usernameValid = true;
          this.usernameMsg = data.message;
        }
      })
    }else {
      this.usernameMsg = null;
    }
  }


  ngOnInit() {
  }

}
