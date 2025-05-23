import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProductListComponent],
  providers: [ProductService],
  template: `
    <app-product-list></app-product-list>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #121212; /* Fundo bem escuro para toda a aplicação */
    }
  `]
})
export class AppComponent {
  title = 'stock-front';
}
