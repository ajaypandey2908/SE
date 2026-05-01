import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() {}

  // Get user details from localStorage
  userDetails(): any {
    const user = localStorage.getItem('user-info');
    return user ? JSON.parse(user) : null;
  }

  // Get token from localStorage
  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Optional helper to show messages (stub)
  messageServ_withDuration(type: string, title: string, message: string, duration: number) {
    console.log(`${type.toUpperCase()} - ${title}: ${message} (${duration}ms)`);
  }

  // Optional API error handler stub
  apiCallReqError() {
    console.warn('API request error occurred.');
  }

  // Optional stub for roles
  getUserRoleName() {
    return null;
  }
}
