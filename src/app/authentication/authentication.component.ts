import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  public loginForm: FormGroup;
  public submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  get loginFormControl(){
    return this.loginForm.controls;
  }

  Submit(){
    const {username, password} = this.loginFormControl
    const user = {
      email: username.value,
      password: password.value
    }
    this.authservice.login(user).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      err => {
        console.error('Error en el inicio de sesión:', err);
      }
    );
  }
}
