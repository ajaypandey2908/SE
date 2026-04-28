import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public configuration: any;
  private http!: HttpClient;

  constructor(private handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }
  
  // load() {
  //   return this.http
  //     .get('assets/config_live.json?cb=' + new Date().getTime())
  //     .toPromise()
  //     .then(data => {
  //       this.configuration = data;
  //     });
  // }
}
