import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  server_url = 'http://localhost:3000'

  constructor(private http:HttpClient) {
    this.updateWishlistCount();
    this.updateCartCount();
   }

  // common function for header creation
  addTokenHeader(){
    let headers = new HttpHeaders();
    const token = sessionStorage.getItem("token");
    if(token){
      headers= headers.append('Authorization',`Bearer ${token}`)
    }
    return {headers}
  }

  // behavior subject creation for wishlist
  wishlistCount = new BehaviorSubject(0)
  
  updateWishlistCount(){
    this.getWishlistItems().subscribe((res:any)=>{
      this.wishlistCount.next(res.length)
    })
  }

  // behavior subject creation for cart
  cartCount = new BehaviorSubject(0)

  updateCartCount(){
    this.getAllCartitems().subscribe((res:any)=>{
      this.cartCount.next(res.length)
    })
  }

  // get all products api call
  getAllProductsApi(){
    return this.http.get(`${this.server_url}/all-product`)
  }

  // register user
  registerUserApi(user:any){
    return this.http.post(`${this.server_url}/register`, user)
  }

  //login user
  loginUserApi(user:any){
    return this.http.post(`${this.server_url}/login`,user)
  }

  //get product details by id
  getProductApi(id:any){
    return this.http.get(`${this.server_url}/get-product/${id}`)
  }

  // add to wishlist
  addToWishlistApi(product:any){
    return this.http.post(`${this.server_url}/add-wishlist`,product,this.addTokenHeader())
  }

  //get from wishlist
  getWishlistItems(){
    return this.http.get(`${this,this.server_url}/wishlist/allproduct`,this.addTokenHeader())
  }

  // removeItem form wishlist
  removeItemFromWishlist(id:any){
    return this.http.delete(`${this.server_url}/wishlist/removeItem/${id}`,this.addTokenHeader())
  }

  //add item to cart
  addToCartApi(product:any){
    return this.http.post(`${this.server_url}/add-cart`,product,this.addTokenHeader())
  }

  //get all cart items
  getAllCartitems(){
    return this.http.get(`${this.server_url}/cart/allProduct`,this.addTokenHeader())
  }
  
  //remove item from cart
  removeCartItem(id:any){
    return this.http.delete(`${this.server_url}/cart/remove-item/${id}`,this.addTokenHeader())
  }

  // increment item in cart
  incrementCartItem(id:any){
    return this.http.get(`${this.server_url}/cart/increment/${id}`,this.addTokenHeader())
  }

  // decrement item in cart
  decrementCartItem(id:any){
    return this.http.get(`${this.server_url}/cart/decrement/${id}`,this.addTokenHeader())
  }

  // empty cart
  emptyAllCartProducts(){
    return this.http.delete(`${this.server_url}/empty-cart`,this.addTokenHeader())
  }
}
