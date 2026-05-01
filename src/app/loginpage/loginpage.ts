import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpApiService } from '../http-api.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-loginpage',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule,ToastModule,MessageModule],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.scss',
  providers: [MessageService],
})
export class Loginpage {
  loginPageForm!: FormGroup;
  obj_loginpage: any

  constructor(private fb: FormBuilder, private router: Router, private httpApiService: HttpApiService,private messageService: MessageService) {
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
      const state = history.state;

  if (state?.showLogoutToast) {
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Logged Out',
        detail: 'You have been logged out successfully',
        life: 2000
      });
    }, 100);
  }
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
