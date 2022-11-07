import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import AuthService from 'src/app/services/auth-service';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.scss']
})
export class AuthCardComponent implements OnInit {
  hide!: boolean;
  displayError!: boolean;
  userForm!: any;

  @Input() title: string = '';
  @Input() labelBtn: string = '';
  @Input() labelAuth: string = '';
  @Input() labelAuth2: string = '';
  @Input() linkAuth: string = '';
  @Input() from: string = '';



  constructor(private _fb: FormBuilder, private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {
    this.hide = true;
    this.displayError = false;

    if(this.from === 'inscription'){
      this.userForm = this._fb.group({
        lastName: ['', Validators.required],
        firstName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
      });
    }else if(this.from === 'connexion'){
      this.userForm = this._fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
      });
    }
  }

  onSubmit(){
    console.log("toto");
    // if(this.from === 'connexion'){
    //   this._auth._connexion(this.userForm.value).subscribe({
    //     next: () => {
    //       this._router.navigate(['dashboard']);
    //     }
    //   });
    // }else if(this.from === 'inscription'){
    //   this._auth._inscription(this.userForm.value).subscribe({
    //     next: () => {
    //       this._router.navigate(['dashboard']);
    //     }
    //   })
    // }
  }
}
