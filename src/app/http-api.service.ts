import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  private baseUrl = 'https://api2023.zerolite.in/api';

  constructor(private http: HttpClient) { }

  Login_Page(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  dashboard_List(data: any, dt: any, subloc: any, model_no: any, pc: any, pt: any, sp: any) {
    return this.http.post(
      `${this.baseUrl}/opening_stock/opening_stock_PageList/${dt}-${subloc}-${model_no}-${pc}-${pt}-${sp}`,
      data
    );
  }

  dashboard_Save(data: any) {
    return this.http.post(`${this.baseUrl}/opening_stock/save`, data); // ✅ Fixed: was "return this, this.http..."
  }

  Get_SRNO(srno: any) {
    return this.http.get(`${this.baseUrl}/opening_stock/getbyid/${srno}`);
  }

  GetAll_SRNO(srno: any) {
    return this.http.get(`${this.baseUrl}/opening_stock_serialnos/getall/${srno}`);
  }

  stock_Refresh(data: any) {
    return this.http.post(`${this.baseUrl}/opening_stock/refresh`, data);
  }

  derialnos_GetById(srno: any) {
    return this.http.get(`${this.baseUrl}/opening_stock_serialnos/getbyid/${srno}`);
  }

  derialnos_save(data: any) {
    return this.http.post(`${this.baseUrl}/opening_stock_serialnos/save`, data);
  }
}