import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { CommonResponse } from '../common/common-response';
import { ApiService } from '../api.service';

import { environment } from "../../environments/environment";

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  environment:any = environment;
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  public loginError: String;

  constructor(private apiService: ApiService, private router: Router, private authService: SocialAuthService, private cookieService: CookieService) {

    this.apiService.logout();
  }


  ngOnInit(): void {

    this.authService.authState.subscribe((user) => {
      if (!this.cookieService.get('currentUser')) {
        this.apiService.socialLogin(user).subscribe((data) => {
          console.log(data);
          if (data.status === 200 && !data.body.ErrorCode) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = data.body.message;
          }
        },
          error => this.loginError = error
        );
        // this.user = user;
        // this.loggedIn = (user != null);
      }
    });
  }


  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value)
        .subscribe((data) => {
          console.log(data);
          if (data.status === 200 && !data.body.ErrorCode) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = data.body.message;
          }
        },
          error => this.loginError = "Invalid login details"
        );
    }
  }
}
