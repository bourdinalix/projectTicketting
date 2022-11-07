import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  currentTitle: string = 'Bienvenue !';
  currentLabelBtn: string = 'Inscription';
  currentLabelAuth: string = "Vous avez un compte ? ";
  currentLabelAuth2: string = "Connectez-vous !";
  currentLinkAuth: string = "login";
  from: string = "register";

  constructor() { }

  ngOnInit(): void {}

}
