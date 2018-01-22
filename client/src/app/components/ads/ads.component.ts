import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import { AdService} from '../../services/ad.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingAds = false;
  form;

  constructor(private formBuilder: FormBuilder, private adService: AdService) {
    this.createNewAdForm();
  }

  createNewAdForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(6),
        this.alphaNumericValidation
      ])],

      desc: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(300),
        Validators.minLength(20),
        this.alphaNumericValidation
      ])]

    });
  }


  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9.,' ]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return {'alphaNumericValidation': true}
    }
  }

  newAdForm(){
    this.newPost = true;
  }

  cancelAdForm(){
    this.newPost = false;
  }

  refreshAds(){
    this.loadingAds = true;
    // Get all ads
    setTimeout(() => {
      this.loadingAds = false;
    }, 4000);
  }

  disableNewAdForm(){
    this.form.get('title').disable();
    this.form.get('desc').disable();
  }

  enableNewAdForm(){
    this.form.get('title').enable();
    this.form.get('desc').enable();
  }

  onNewAdFormSubmit(){

    this.disableNewAdForm();

    const ad = {
      title: this.form.get('title').value,
      description: this.form.get('desc').value,
    }

    this.adService.saveAd(ad).subscribe(data => {
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.enableNewAdForm();
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.newPost = false;
          this.message = false;
          this.enableNewAdForm();
          this.form.reset();
        }, 2000)
      }
    });
  }

  ngOnInit() {
  }

}
