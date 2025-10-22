import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import {} from '@angular/common/http';
import { ProductCategoryMenuComponent } from "./components/product-category-menu/product-category-menu.component";
import { SearchComponent } from './components/search/search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CartStatusComponent, NgbModule, SearchComponent, RouterModule, 
              ProductCategoryMenuComponent, ProductCategoryMenuComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'angular-ecommerce';
}
