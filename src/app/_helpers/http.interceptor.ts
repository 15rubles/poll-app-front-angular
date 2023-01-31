import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    private apiServerUrl = environment.apiBaseUrl;;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url !== `${this.apiServerUrl}/user/registration`)
            req = req.clone({
                withCredentials: true,
            });

        return next.handle(req);
    }
}
