import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  allProduct: any = [];
  totalAmount: any = 0;
  constructor(private api: ApiService, private route: Router) { }
  ngOnInit(): void {
    this.getAllCartItems()
  }
  getAllCartItems() {
    this.api.getAllCartitems().subscribe({
      next: (res: any) => {
        console.log("All cart items");
        console.log(res)
        this.allProduct = res;
        this.getTotalPrice()
      },
      error: (res: any) => {
        console.log(res)
      }
    })
  }
  removeItem(id: any) {
    this.api.removeCartItem(id).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: "Done",
          text: "Successfully removed from cart",
          icon: "success"
        });
        this.api.updateCartCount()
        this.getAllCartItems()
      },
      error: (res: any) => {
        console.log(res)
      }
    })
  }
  getTotalPrice() {
    if (this.allProduct.length > 0) {
      this.totalAmount = Math.ceil(this.allProduct.map((item: any) => item.grandTotal).reduce((amt1: any, amt2: any) => amt1 + amt2))
      console.log(this.totalAmount);

    } else {
      this.totalAmount = 0
    }
  }

  incrementCartProduct(id: any) {
    this.api.incrementCartItem(id).subscribe({
      next: (res: any) => {
        this.getAllCartItems();
        this.api.updateCartCount()
      },
      error: (res: any) => {
        console.log(res)
      }
    })
  }
  decrementCartProduct(id: any) {
    this.api.decrementCartItem(id).subscribe({
      next: (res: any) => {
        this.getAllCartItems();
        this.api.updateCartCount()
      },
      error: (res: any) => {
        console.log(res)
      }
    })
  }
  emptyCart() {
    this.api.emptyAllCartProducts().subscribe({
      next: (res: any) => {
        this.getAllCartItems();
        this.api.updateCartCount();
      },
      error: (res: any) => {
        console.log(res)
      }
    })

  }
  checkout() {
    sessionStorage.setItem("totalAmnt",this.totalAmount)
    this.route.navigateByUrl("checkout")
  }

}
