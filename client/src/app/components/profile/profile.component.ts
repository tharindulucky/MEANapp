import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name;
  username;
  email;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    //noinspection TypeScriptUnresolvedFunction
    this.authService.getProfile().subscribe(profile => {

      this.name = profile.user.name;
      this.username = profile.user.username;
      this.email = profile.user.email;

    });
  }

}
