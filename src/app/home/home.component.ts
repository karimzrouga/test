import { Component } from '@angular/core';
import { User } from '../model/User';
import { Router } from '@angular/router';
import { usersService } from '../services/users.service';
import { AuthUserService } from '../services/auth-user.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Userauth } from '../model/Userauth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const USER_KEY = 'auth-user';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  userauth: Userauth  =new  Userauth()
  errorMessage = 'Invalid Credentials';
  successMessage!: string;
  invalidLogin = false;
  public loginSuccess = false;
  userForm!: FormGroup;
  showPassword: boolean = false;
  constructor(private router: Router, private userser: AuthUserService) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      Mdp: new FormControl('', [Validators.required])
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  Login() {
   if (this.userForm.valid)
{     this.userauth=this.userForm.value
  console.log(this.userauth)
    this.userser.login(this.userauth).subscribe(
      (datas ) => {
     
        if (datas !=null ) {
       
        this.userser.savesession(datas.userId,datas.token,datas.role,datas.permissionId,datas.routes)
          this.invalidLogin = false;
          this.loginSuccess = true;

          this.successMessage = 'Login Successful.';

          this.router.navigate(['/profile']);
        
        } 
       
      
      
    }, (error :HttpErrorResponse) => {
      //this.errorMessage=error.error.message ;
      this.invalidLogin=true
      console.log(error)
    });
    
}
else{
  this. errorMessage = 'Email or Password incorrect.';
  this.invalidLogin=true
}
  }
}