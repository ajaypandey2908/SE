import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url.includes('/login')) {
            return next.handle(request);
        }

        const data = localStorage.getItem('user-info');
        let token: string | null = null;

        if (data) {
            const parsed = JSON.parse(data);
            // Try both possible token locations
            token = parsed?.token ?? parsed?.data?.token ?? null;
        }

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    localStorage.clear();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}