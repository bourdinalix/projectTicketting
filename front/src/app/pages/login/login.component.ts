import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  currentTitle: string = 'Bon retour !';
  currentLabelBtn: string = 'Connexion';
  currentLabelAuth: string = "Vous n\'avez pas de compte ? ";
  currentLabelAuth2: string = "Inscrivez vous gratuitement !";
  currentLinkAuth: string = "register";
  from: string = "login";

  constructor() { }

  ngOnInit(): void {}
}
