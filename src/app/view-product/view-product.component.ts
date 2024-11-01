import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  productData:any=[];
  constructor(private api: ApiService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      const id = res.id;
      console.log("id", id);
      this.getProduct(id)
    })
  }

  getProduct(id: any) {
    this.api.getProductApi(id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.productData = res;
      },
      error:(res:any)=>{
        console.log(res)
      }
    })
  }
  addToWishlist(product:any){
    if(sessionStorage.getItem("token")){
      this.api.addToWishlistApi(product).subscribe({
        next:(res:any)=>{
          Swal.fire({
            title: "Done",
            text: "Successfully added to wishlist",
            icon: "success"
          });
          this.api.updateWishlistCount()
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
    else{
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
