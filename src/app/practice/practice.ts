import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-practice',
  imports: [DatePickerModule, FormsModule,ImageModule],
  templateUrl: './practice.html',
  styleUrl: './practice.scss',
})
export class Practice {
  
}
