import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CurrencyPipe, RouterLink],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  product!: Product;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    // get the "id" parm string and convert that to a number using the "+" symbol

    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => { this.product = data; }
    )
  }

}
