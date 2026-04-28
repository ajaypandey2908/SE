import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-upload',
  imports: [ButtonModule, CheckboxModule, IconFieldModule, InputIconModule, InputTextModule, FormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {
  name: string = '';
    email: string = '';
    accept: boolean = false;
}
