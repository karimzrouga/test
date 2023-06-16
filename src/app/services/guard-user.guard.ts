import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild,Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from '../services/auth-user.service';


@Injectable({
  providedIn: 'root'
})
export class GuardUserGuard implements CanActivate {
  constructor(private aus:AuthUserService,private router:Router){

  }
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   let role= sessionStorage.getItem("role")
  
    const { routeConfig } = route; // provides the route configuration options
    const { path } = routeConfig as Route; // provides the path of the route

    console.log(role)
    console.log(path)
    
    if (path?.includes('admin') || path?.includes('profile')  ) {
      console.log("hello0")
      if( role?.includes('admin')){
     
        return true
        
      }else
      {
        this.router.navigateByUrl('/');
      }
       
      }
      if (path?.includes('responsabletransport')  || path?.includes('profile')) {
        console.log("hello0")
        if( role?.includes('responsabletransport')){
       
          return true
          
        }
        {
          this.router.navigateByUrl('/');
        }
        }
   
    this.router.navigateByUrl('/'); // for any other condition, navigate to the res route
    return false;
  }
}