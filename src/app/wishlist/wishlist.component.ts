import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  allProduct:any = [];
  constructor(private api: ApiService) { }
  ngOnInit(): void {
    this.getWishlistItems();
  }
  getWishlistItems() {
    this.api.getWishlistItems().subscribe({
      next:(res:any)=>{
        console.log(res);
        this.allProduct = res;
      },
      error:(res:any)=>{
        console.log(res)
      }
    })
  }

  removeItem(id:any){
    this.api.removeItemFromWishlist(id).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: "Done",
          text: "Successfully removed from wishlist",
          icon: "success"
        });
        this.api.updateWishlistCount()
        this.getWishlistItems();
      },
      error:(res:any)=>{
        Swal.fire({
          title: "Oops",
          text: res.error,
          icon: "error"
        });
      }
    })
  }

  addTocart(product:any) {
    if (sessionStorage.getItem("token")) {
      Object.assign(product,{quantity:1});
      this.api.addToCartApi(product).subscribe({
        next:(res:any)=>{
          Swal.fire({
            title: "Done",
            text: "Successfully added to cart",
            icon: "success"
          });
          this.api.updateCartCount();
        },
        error:(res:any)=>{
          console.log(res)
        }
      })

    }
    else {
      Swal.fire({
        title: "Oops",
        text: "Please login",
        icon: "warning"
      });
    }
  }
}
