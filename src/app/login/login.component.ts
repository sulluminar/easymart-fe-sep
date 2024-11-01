import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private fb: FormBuilder, private api: ApiService,private route:Router) { }
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })
  loginUser() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const user = {
        email,
        password
      }
      this.api.loginUserApi(user).subscribe({
        next:(res:any)=>{
          console.log(res)
          sessionStorage.setItem("username",res.existingUser.username);
          sessionStorage.setItem("token",res.token)
          Swal.fire({
            title: "Done",
            text: "User logged in successfully",
            icon: "success"
          });
          this.api.updateWishlistCount();
          this.api.updateCartCount();
          this.route.navigateByUrl("")
        },
        error:(res:any)=>{
          Swal.fire({
            title: "Error !!",
            text: "Invalid email or password",
            icon: "error"
          });
        }
      })
    }

  }

}
