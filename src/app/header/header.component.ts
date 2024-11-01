import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  wishlistItemCount: number = 0;
  cartItemCount: number = 0;
  constructor(private route: Router, private api: ApiService) { }

  loginUsername: any = "";
  ngOnInit(): void {
    if (sessionStorage.getItem("username")) {
      this.loginUsername = sessionStorage.getItem("username");
      this.api.wishlistCount.subscribe((res: any) => {
        this.wishlistItemCount = res;
      })
      this.api.cartCount.subscribe((res:any)=>{
        this.cartItemCount = res;
      })
    }
    else {
      this.loginUsername = ""
    }
  }

  logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    this.route.navigateByUrl("");
    this.loginUsername = ""
    this.wishlistItemCount=0;
    this.cartItemCount = 0;
  }
}
