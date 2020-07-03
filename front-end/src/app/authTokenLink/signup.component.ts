import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import { CommonResponse } from '../common/common-response';
import { ApiService } from '../api.service';


// import { SocialAuthService } from "angularx-social-login";
// import { FacebookLoginProvider } from "angularx-social-login";
// import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-authTokenLink',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  public loginError: String;

  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.apiService.logout(); }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['token']){
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
  }

  
}
