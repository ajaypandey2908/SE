import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpApiService } from '../http-api.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePickerModule, FormsModule, CommonModule, ReactiveFormsModule,
    AutoCompleteModule, MessageModule, ToastModule, ButtonModule, PaginatorModule],
  templateUrl: `./dashboard.html`,
  styleUrl: './dashboard.scss',
  providers: [MessageService]
})
export class Dashboard implements OnInit {

  // messageService = inject(MessageService);
  items: any[] | undefined;
  formSubmitted: boolean = false;
  // searchQuery = '';
  filterBillNo = '';
  filterSupplierQuery = '';
  filterLocationQuery = '';

  onSubmit() {
    this.formSubmitted = true;
    if (this.componentListForm.valid) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      this.componentListForm.reset();
      this.formSubmitted = false;
    }
  }

  isInvalid(controlName: string) {
    const control = this.componentListForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  currentPage = 0;
  rowsPerPage = 10;
  totalRecords = 0;
  paginatedList: any[] = [];
  obj_componentList: any[] = [];
  obj_refresh: any;
  filteredList: any[] = [];
  selectedRowData: any = { data: [] };
  currentSerialItem: any = null;
  activeSection: string = 'table';
  mode: 'add' | 'edit' = 'add';
  selectedItem: any = null;
  ossrno = 0;
  searchQuery = '';
  productPreview: string | null = null;
  purchasePreview: string | null = null;
  serialPreview: string | null = null;
  serialBase64: string | null = null;
  componentListForm!: FormGroup;
  openingStockSaveForm!: FormGroup;
  location: string[] = [];
  subLocation: string[] = [];
  productNames: string[] = [];
  partNames: string[] = [];
  categories: string[] = [];
  types: string[] = [];
  companies: string[] = [];
  models: string[] = [];
  suppliers: string[] = [];
  filteredLocation: string[] = [];
  filteredSubLocation: string[] = [];
  filteredProductNames: string[] = [];
  filteredPartNames: string[] = [];
  filteredCategories: string[] = [];
  filteredTypes: string[] = [];
  filteredCompanies: string[] = [];
  filteredModels: string[] = [];
  filteredSuppliers: string[] = [];
  serialSearch: string = '';


  constructor(
    private httpApiService: HttpApiService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router
  ) { }
  get productCount(): number {
    return this.obj_componentList.filter((i) => i.is_product_spare === 'Product').length;
  }

  get spareCount(): number {
    return this.obj_componentList.filter((i) => i.is_product_spare === 'Spare').length;
  }

  get locationCount(): number {
    return new Set(this.obj_componentList.map((i) => i.location).filter(Boolean)).size;
  }

  ngOnInit() {
    const navigation = history.state;

    if (navigation?.showLogoutToast) {
      this.messageService.add({
        severity: 'success',
        summary: 'Logged Out',
        detail: 'You have been logged out successfully',
        life: 2000
      });
    }

    this.activeSection = 'table';
    this.componentListForm = this.fb.group({
      srno: [0],
      location: ['', Validators.required],
      sub_location: ['', Validators.required],
      supplier: ['', Validators.required],
      purchase_date: [new Date()],
      purchase_ref_no: ['', Validators.required],
      product_name: ['', Validators.required],
      part_name: ['', Validators.required],
      model_no: ['', Validators.required],
      product_category: ['', Validators.required],
      product_type: ['', Validators.required],
      is_product_spare: [0],
      mfg_date: [new Date()],
      company: [''],
      product_imgBase64: [''],
      purchase_imgBase64: [''],
      product_img: [''],
      purchase_img: [''],
      mrp: [0],
      purchase_rate: [0],
      qty: [0],
    });

    this.openingStockSaveForm = this.fb.group({
      disID: [0],
      srno: [0],
      status: [1],
      os_srno: [0],
      serial_no1: [''],
      serial_no2: [''],
      serial_img: [''],
      qty: [0],
      serial_imgBase64: [''],
    });

    this.showList();

  }

  showTab(section: string) {
    this.activeSection = section;
    if (section === 'table') {
      this.showList();
    }
  }

  showList() {
    const reqBody = {
      searchString: '',
      text1: 'NA',
      text2: 'NA',
      text3: 'NA',
      text4: 'NA',
      pageNo: 1,
      sortField: 15,
      pageSize: 100,
    };

    const dt = 'NA';
    const subloc = 'NA';
    const model_no = 'NA';
    const pc = 'NA';
    const pt = 'NA';
    const sp = 'NA';

    this.httpApiService.dashboard_List(reqBody, dt, subloc, model_no, pc, pt, sp).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.obj_componentList = res.data;
          this.location = [
            ...new Set(
              this.obj_componentList
                .map(i => i.location)
                .filter(l => l && l !== 'NA')
            )
          ];
          this.subLocation = [
            ...new Set(
              this.obj_componentList
                .map(i => i.sub_location)
                .filter(l => l && l !== 'NA')
            )
          ];
          this.suppliers = [
            ...new Set(
              this.obj_componentList
                .map(i => i.supplier)
                .filter(s => s && s !== 'NA')
            )
          ];
          this.productNames = [
            ...new Set(
              this.obj_componentList
                .map(i => i.product_name)
                .filter(p => p && p !== 'NA')
            )
          ];
          this.partNames = [
            ...new Set(
              this.obj_componentList
                .map(i => i.part_name)
                .filter(p => p && p !== 'NA')
            )
          ];
          this.categories = [
            ...new Set(
              this.obj_componentList
                .map(i => i.product_category)
                .filter(c => c && c !== 'NA')
            )
          ];
          this.models = [
            ...new Set(
              this.obj_componentList
                .map(i => i.model_no)
                .filter(m => m && m !== 'NA')
            )
          ];
          this.types = [
            ...new Set(
              this.obj_componentList
                .map(i => i.product_type)
                .filter(t => t && t !== 'NA')
            )
          ];
          this.companies = [
            ...new Set(
              this.obj_componentList
                .map(i => i.company)
                .filter(c => c && c !== 'NA')
            )
          ];
        } else {
          this.obj_componentList = [];
        }
        this.filterList();
        this.cd.detectChanges();
      },
      error: () => {
        this.obj_componentList = [];
        this.filteredList = [];
      },
    });
  }


  Stock_Refresh() {
    const payload = this.componentListForm.value;
    this.httpApiService.stock_Refresh(payload).subscribe({
      next: (res: any) => {
        if (res.issuccess) {
          this.obj_refresh = res.data;
          this.location = [...new Set(this.obj_componentList.map(i => i.location))];
          this.subLocation = [...new Set(this.obj_componentList.map(i => i.subLocation))];
          this.suppliers = [...new Set(this.obj_componentList.map(i => i.supplier))];
          this.productNames = [...new Set(this.obj_componentList.map(i => i.product_name))];
          this.partNames = [...new Set(this.obj_componentList.map(i => i.part_name))];
          this.categories = [...new Set(this.obj_componentList.map(i => i.product_category))];
          this.models = [...new Set(this.obj_componentList.map(i => i.model_no))];
          this.types = [...new Set(this.obj_componentList.map(i => i.product_type))];
          this.companies = [...new Set(this.obj_componentList.map(i => i.company))];
          console.log('Response successfull refresh api', res);
        }
      },
      error: (err: any) => {
        console.log('Error occured', err);
      },
    });
  }

  filterLocation(event: any) {
    const query = event.query.toLowerCase();

    this.filteredLocation = this.location.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filterSubLocation(event: any) {
    const query = event.query.toLowerCase();

    this.filteredSubLocation = this.subLocation.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filterSupplier(event: any) {
    const query = event.query.toLowerCase();

    this.filteredSuppliers = this.suppliers.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filtereProductNames(event: any) {
    const query = event.query.toLowerCase();

    this.filteredProductNames = this.productNames.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filterePartNames(event: any) {
    const query = event.query.toLowerCase();

    this.filteredPartNames = this.partNames.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filterModelNo(event: any) {
    const query = event.query.toLowerCase();

    this.filteredModels = this.models.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filterCategory(event: any) {
    const query = event.query.toLowerCase();

    this.filteredCategories = this.categories.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filterType(event: any) {
    const query = event.query.toLowerCase();

    this.filteredTypes = this.types.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  filterCompany(event: any) {
    const query = event.query.toLowerCase();

    this.filteredCompanies = this.companies.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  searchSerial() {
    const q = this.serialSearch.toLowerCase().trim();

    if (!q) {
      this.httpApiService.GetAll_SRNO(this.ossrno).subscribe((res: any) => {
        if (res.issuccess) {
          this.selectedRowData = { ...res };
        }
      });
      return;
    }

    this.selectedRowData = {
      ...this.selectedRowData,
      data: this.selectedRowData.data.filter(
        (s: any) =>
          (s.serial_no1 || '').toLowerCase().includes(q) ||
          (s.serial_no2 || '').toLowerCase().includes(q),
      ),
    };
  }

  filterList() {
    const q = (this.searchQuery || '').toLowerCase().trim();
    const bill = (this.filterBillNo || '').toLowerCase().trim();
    const supplier = (this.filterSupplierQuery || '').toLowerCase().trim();
    const location = (this.filterLocationQuery || '').toLowerCase().trim();

    const filtered = this.obj_componentList.filter(i => {
      const matchProduct = !q || (i.product_name || '').toLowerCase().includes(q);
      const matchBill = !bill || (i.purchase_ref_no || '').toLowerCase().includes(bill);
      const matchSupplier = !supplier || (i.supplier || '').toLowerCase().includes(supplier);
      const matchLocation = !location || (i.location || '').toLowerCase().includes(location);
      return matchProduct && matchBill && matchSupplier && matchLocation;
    });

    this.filteredList = filtered;
    this.totalRecords = filtered.length;
    this.currentPage = 0;
    this.updatePage();
  }


  updatePage() {
    const start = this.currentPage * this.rowsPerPage;
    this.paginatedList = this.filteredList.slice(start, start + this.rowsPerPage);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.updatePage();
  }

  openAdd() {
    this.mode = 'add';
    this.selectedItem = null;
    this.productPreview = null;
    this.purchasePreview = null;
    this.componentListForm.reset({
      srno: 0,
      purchase_date: new Date(),
      mfg_date: new Date(),
      is_product_spare: '',
    });
    this.activeSection = 'form';
  }


  onEdit(item: any) {
    this.mode = 'edit';

    this.productPreview = null;
    this.purchasePreview = null;

    this.httpApiService.Get_SRNO(item.srno).subscribe({
      next: (res: any) => {
        if (res.issuccess) {
          //  console.log('FULL RES:', JSON.stringify(res, null, 2)); 
          const d = res.data;

          this.componentListForm.patchValue({
            ...d,
            purchase_date: new Date(d.purchase_date),
            mfg_date: new Date(d.mfg_date),
          });

          const BASE_URL = 'https://api2023.zerolite.in/';
          const productSrc = d.product_img ? `${BASE_URL}${d.product_img}` : null;
          const purchaseSrc = d.purchase_img ? `${BASE_URL}${d.purchase_img}` : null;

          this.activeSection = 'form';
          this.cd.detectChanges();

          setTimeout(() => {
            this.productPreview = productSrc;
            this.purchasePreview = purchaseSrc;
            this.cd.detectChanges();
          }, 50);
        }
      },
      error: (err) => console.error('Get_SRNO error:', err),
    });
  }

  saveDetails() {
    if (this.componentListForm.invalid) {
      this.componentListForm.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields ⚠️'
      });
      return;
    }

    const payload = { ...this.componentListForm.value };

    if (this.mode === 'add' && !payload.is_product_spare) {
      payload.is_product_spare = 0;
    }

    this.httpApiService.dashboard_Save(payload).subscribe({
      next: (res: any) => {
        console.log('Saved successfully:', res);

        this.showList();

        this.componentListForm.reset({
          srno: 0,
          purchase_date: new Date(),
          mfg_date: new Date(),
          is_product_spare: '',
          qty: 0,
          mrp: 0,
          purchase_rate: 0,
        });

        this.productPreview = null;
        this.purchasePreview = null;
        this.mode = 'add';
        this.activeSection = 'table';
      },
      error: (err) => console.error('Save error:', err),
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Stock saved successfully ✅'
    });

  }


  openSerial(item: any) {
    this.currentSerialItem = item;
    this.ossrno = item.srno;
    this.serialPreview = null;
    this.serialBase64 = null;
    this.openingStockSaveForm.reset({ disID: 0, srno: 0, status: 1, os_srno: 0, qty: 0 });
    this.selectedRowData = { data: [] };

    this.httpApiService.GetAll_SRNO(item.srno).subscribe({
      next: (res: any) => {
        if (res.issuccess) {
          this.selectedRowData = { ...res };
          this.activeSection = 'serial';
          this.cd.detectChanges();
        }
      },
      error: (err) => console.error('GetAll_SRNO error:', err),
    });
  }

  derialnosSave() {
    const payload = { ...this.openingStockSaveForm.value };
    payload.os_srno = this.ossrno;

    if (this.serialBase64) {
      payload.serial_imgBase64 = this.serialBase64;
    }
    const newEntry = {
      serial_no1: payload.serial_no1,
      serial_no2: payload.serial_no2,
      qty: payload.qty,
      serial_imgBase64: payload.serial_imgBase64 || null,
    };

    this.selectedRowData = {
      ...this.selectedRowData,
      data: [...(this.selectedRowData?.data || []), newEntry],
    };
    this.openingStockSaveForm.reset({
      disID: 0,
      srno: 0,
      status: 1,
      os_srno: 0,
      qty: 0,
    });
    this.serialPreview = null;
    this.serialBase64 = null;
    this.cd.detectChanges();
    this.httpApiService.derialnos_save(payload).subscribe({
      next: (res: any) => {
        console.log('Serial saved:', res);
        this.httpApiService.GetAll_SRNO(this.ossrno).subscribe({
          next: (freshRes: any) => {
            if (freshRes.issuccess) {
              this.selectedRowData = { ...freshRes };
              this.cd.detectChanges();
            }
          },
          error: (err) => console.error('GetAll_SRNO refresh error:', err),
        });
      },
      error: (err) => {
        console.error('Serial save error:', err);
        this.selectedRowData = {
          ...this.selectedRowData,
          data: this.selectedRowData.data.slice(0, -1),
        };
        this.cd.detectChanges();
      },
    });
  }


  onFileSelect(event: any, type: 'product' | 'purchase') {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];

      if (type === 'product') {
        this.productPreview = result;
        this.componentListForm.patchValue({
          product_img: ext,
          product_imgBase64: base64
        });
      } else {
        this.purchasePreview = result;
        this.componentListForm.patchValue({
          purchase_img: ext,
          purchase_imgBase64: base64
        });
      }
      this.cd.detectChanges();
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }


  onSerialPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];

      this.serialPreview = result;
      this.openingStockSaveForm.patchValue({
        serial_img: ext,
        serial_imgBase64: base64
      });

      this.cd.detectChanges();
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }

  onEdits(s: any) {
    this.serialPreview = null;

    this.httpApiService.derialnos_GetById(s.srno).subscribe({
      next: (res: any) => {
        if (res.issuccess) {
          const d = res.data;
          const BASE_URL = 'https://api2023.zerolite.in/';
          const serialSrc = d.serial_img
            ? `${BASE_URL}${d.serial_img}`
            : null;

          this.openingStockSaveForm.patchValue({
            ...d,
            qty: d.qty || 0,
          });

          setTimeout(() => {
            this.serialPreview = serialSrc;
            this.cd.detectChanges();
          }, 50);
        }
      },
      error: (err) => console.error('derialnos_GetById error:', err),
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.filterBillNo = '';
    this.filterSupplierQuery = '';
    this.filterLocationQuery = '';
    this.filterList();
  }

  logOut() {
  console.log('Logout clicked');
  localStorage.clear();

  this.router.navigate(['/login'], {
    state: {
      showLogoutToast: true
    }
  });
}
}