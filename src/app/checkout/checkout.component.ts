import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  public makePaymentStatus: boolean = false;
  proceedToPayStatus: boolean = false;
  totalAmountToPay: any = 0;
  constructor(private fb: FormBuilder, private router:Router, private api:ApiService) { }
  checkoutForm = this.fb.group({
    uname: ["", [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    apartment: ["", [Validators.required, Validators.pattern('[a-zA-Z0-9, ]*')]],
    place: ["", [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    pincode: ["", [Validators.required, Validators.pattern('[0-9]*')]]
  })
  ngOnInit(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.totalAmountToPay,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.totalAmountToPay
              }
            }
          },
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details:any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        alert("Payment successfull")
        this.api.emptyAllCartProducts().subscribe({
          next: (res: any) => {
            this.api.updateCartCount();
          },
          error: (res: any) => {
            console.log(res)
          }
        })
        this.router.navigateByUrl("");
        this.makePaymentStatus = false;
        this.proceedToPayStatus = false;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        alert("Payment cancelled")
        
      },
      onError: err => {
        console.log('OnError', err);
        alert("Transaction failed, Please try again")
      },
     
    };
  }
  proceedToBuy() {
    if (this.checkoutForm.valid) {
      this.proceedToPayStatus = true;
      if (sessionStorage.getItem("totalAmnt")) {
        this.totalAmountToPay = sessionStorage.getItem('totalAmnt')
      }
    }
    else {
      alert("Please fill the form completely")
    }

  }
  back() {
    this.proceedToPayStatus = false;
  }
  makePayment() {
    this.makePaymentStatus = true;
  }

}
