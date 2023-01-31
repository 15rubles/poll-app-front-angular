import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuth = this.isAuthorized(route);
    if (isAuth) {
      return true;
    }
    const role = this.storageService.getUser().role;
    switch (role) {
      case environment.ROLE_USER: {
        this.router.navigate(['/user'])
        break;
      }
      case environment.ROLE_LEAD: {
        this.router.navigate(['/lead'])
        break;
      }
      case environment.ROLE_ADMIN: {
        this.router.navigate(['/admin'])
        break;
      }
      case environment.UNAUTHORIZED: {
        this.router.navigate(['/login'])
        break;
      }
    }
    return false;
  }
  private isAuthorized(route: ActivatedRouteSnapshot): boolean {
    const role = this.storageService.getUser().role;
    const expectedRoles = route.data['expectedRoles'];
    const roleMatches = expectedRoles.indexOf(role);
    return (roleMatches >= 0) ? true : false;
  }
}
