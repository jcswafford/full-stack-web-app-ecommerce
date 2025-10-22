import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-cart-details',
  imports: [NgFor, CurrencyPipe, RouterLink],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.listCartDetails();
  }

  listCartDetails() {

    // get a handle on the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe tot he cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data 
    );

    // compute cart total price and total quantity
    this.cartService.computeCartTotals();

  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }

}
