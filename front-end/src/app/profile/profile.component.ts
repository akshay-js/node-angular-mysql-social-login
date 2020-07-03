import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { CommonResponse } from '../common/common-response';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';

import { FacebookLoginProvider } from 'angularx-social-login';
import { SocialAuthService } from 'angularx-social-login';

import { environment } from "../../environments/environment";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  environment: any = environment;

  constructor(private apiService: ApiService, private router: Router, private authService: SocialAuthService, private cookieService: CookieService) { }
  user: any;
  loginError: any;
  token: string = this.cookieService.get('currentUser');

  profileImage: string;

  ngOnInit(): void {
    this.getProfile();
    this.authService.authState.subscribe((user) => {
      this.apiService.linkFb(user).subscribe((data) => {
        console.log(data);
        this.getProfile();
      },
        error => this.loginError = error
      );
      // this.user = user;
      // this.loggedIn = (user != null);
    });


  }



  getProfile() {
    this.apiService.getProfile().subscribe((res) => {
      this.user = res.data;
      this.profileImage = (res.data['image']) ? res.data['image'] : ((res.data['twitter_image']) ? res.data['twitter_image'] : '../../assets/images/no-image.jpg');
    })
  }

  unlinkFb(type: string) {
    this.apiService.unlinkFb(type).subscribe((res) => {
      this.user = res.data;
    })
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {

    this.apiService.logout();
    this.authService.signOut().then(() => {
      this.apiService.logout();
    });
  }
}
