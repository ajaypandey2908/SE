import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpApiService } from '../http-api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-loginpage',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.scss',
})
export class Loginpage {
  loginPageForm!: FormGroup;
  obj_loginpage: any

  constructor(private fb: FormBuilder, private router: Router, private httpApiService: HttpApiService) {
    this.loginPageFormController();
  }

  loginPageFormController() {
    this.loginPageForm = new FormGroup({

      viplcode: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      loginas: new FormControl(0)

    })
  }

  ngOnInit() {
  }

  onLogin() {

    const payload = this.loginPageForm.value
    this.httpApiService.Login_Page(payload)
      .subscribe({
        next: (res: any) => {
          this.obj_loginpage = res.data;
          if (res.issuccess) {
            localStorage.removeItem('user-info')
            localStorage.setItem('user-info', JSON.stringify(res));
            this.router.navigate(['/dashboard']);
            console.log('Login SuccessFull', res)
          }
          this.loginPageForm.reset();
        },
        error: (err: any) => {
          console.log("API Error:", err);
        }
      });
  }
}
