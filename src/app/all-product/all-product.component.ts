import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {
  allProduct: any = []
  constructor(private api: ApiService) { }
  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct() {
    this.api.getAllProductsApi().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allProduct = res;
      },
      error: (res: any) => {
        console.log(res)
      }
    })
  }

  addToWishlist(product: any) {
    if (sessionStorage.getItem("token")) {
      this.api.addToWishlistApi(product).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: "Done",
            text: "Successfully added to wishlist",
            icon: "success"
          });
          this.api.updateWishlistCount()
        },
        error: (res: any) => {
          Swal.fire({
            title: "Oops",
            text: res.error,
            icon: "error"
          });
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
