import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import { CommonResponse } from '../common/common-response';
import { ApiService } from '../api.service';
import { environment } from "../../environments/environment";

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  environment: any = environment;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  public loginError: String;

  constructor(private apiService: ApiService, private router: Router, private authService: SocialAuthService, private activatedRoute: ActivatedRoute, private cookieService: CookieService) {


    this.cookieService.deleteAll();
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['token']) {
        this.apiService.loginByToken(params['token']).subscribe((data) => {
          if (data.status === 200 && !data.body.ErrorCode) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = data.body.message;
          }
        },
          error => this.loginError = error
        );
      }

    });

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
      this.apiService.signup(this.loginForm.value)
        .subscribe((data) => {
          console.log(data);
          if (data.status === 200 && !data.body.ErrorCode) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = data.body.message;
          }
        },
          error => {
            console.log(error);
            
            this.loginError = error['error'].error;
          }
        );
    }
  }
}
