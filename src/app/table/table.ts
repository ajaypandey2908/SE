import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-table',
  imports: [SelectModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {}
