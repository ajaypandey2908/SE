import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  bearer: any = JSON.parse(<any>localStorage.getItem("user-info"))
  constructor(
    private http: HttpClient, private configService: ConfigService
  ) {
    console.log(this.bearer);
  }

  Login_Page(data: any) { 
    return this.http.post('https://api2023.zerolite.in/api/login', data);
  }

  dashboard_List(data: any, dt: any, subloc: any, model_no: any, pc: any, pt: any, sp: any) {
    return this.http.post(
      `https://api2023.zerolite.in/api/opening_stock/opening_stock_PageList/${dt}-${subloc}-${model_no}-${pc}-${pt}-${sp}`,
      data,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer?.token}`) });
  }

  dashboard_Save(data: any) {
    return this, this.http.post('https://api2023.zerolite.in/api/opening_stock/save', data,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer?.token}`) });
  }

  Get_SRNO(srno: any) {
    return this.http.get(`https://api2023.zerolite.in/api/opening_stock/getbyid/${srno}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer?.token}`) })

  }

  GetAll_SRNO(srno: any) {
    return this.http.get(`https://api2023.zerolite.in/api/opening_stock_serialnos/getall/${srno}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer?.token}`) })
  }

  stock_Refresh(data:any){
    return this.http.post('https://api2023.zerolite.in/api/opening_stock/refresh',data,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer?.token}`) })
  }

  derialnos_GetById(srno: any) {
    return this.http.get(`https://api2023.zerolite.in/api/opening_stock_serialnos/getbyid/${srno}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer?.token}`) })
  }

  derialnos_save(data: any) {
    return this.http.post('https://api2023.zerolite.in/api/opening_stock_serialnos/save', data,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.bearer?.token}`) })
  }


  postAjaxMethod(url: any, data: any, params?: any) {
    return this.http.post(url, data, params);
  }

  getAjaxMethod(url: any, params?: any) {
    return this.http.get(url, params);
  }

}