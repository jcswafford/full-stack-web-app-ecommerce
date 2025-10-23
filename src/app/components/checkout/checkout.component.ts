import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  shipping: number = 0;
  finalPrice: number = 0;
  neededForFreeShipping: number = 0;
  neededForFreeShippingString: string = "";
  finalPriceString: string = "";

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService: CartService
  ) {}

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        ),
        lastName: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        ),
        email: new FormControl('',
          [Validators.required, 
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), 
            ShopValidators.notOnlyWhitespace]
            // matches for valid email address
            // [a-z0-9._%+-] matches any combination of letters and digits, optional period
            // [a-z0-9.-] matches any combination of letters and digits, with period
            // [a-z]{2,15}$ domain extion with 2-15 letters
        )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        ),
        city: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        ),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        )
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        ),
        city: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        ),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            ShopValidators.notOnlyWhitespace]
        )
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', 
          [Validators.required]),
        nameOnCard: new FormControl('', 
          [Validators.required, 
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace]
        ),
        cardNumber: new FormControl('', 
          [Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(13),
          Validators.maxLength(19),
          ShopValidators.luhnCheck]
        ),
        securityCode: new FormControl('', 
          [Validators.required, 
          Validators.pattern('^[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });


    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1; // add 1 because JS Date object the months are zero based
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }
  
  reviewCartDetails() {
    
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice    
    );

    if (this.totalPrice < 100) {
      this.shipping = 19.99;
      this.neededForFreeShipping = 100 - this.totalPrice;
      this.neededForFreeShippingString = this.neededForFreeShipping.toFixed(2);
    }
    else {
      this.shipping = 0.00;
    }

    this.finalPrice = this.totalPrice + this.shipping;
    this.finalPriceString = this.finalPrice.toFixed(2);

  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard() {return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode');}

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is: " + this.checkoutFormGroup.get('customer').value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);


  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }

  }

  handleMonthsAndYears() {

    const creditCardFormGrop = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedyear: number = Number(creditCardFormGrop.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedyear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );

  }

}
