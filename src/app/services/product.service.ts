import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    { id: 1, name: 'Notebook Dell XPS', price: 8999.99, quantity: 3 },
    { id: 2, name: 'Monitor LG 27"', price: 1299.99, quantity: 8 },
    { id: 3, name: 'Teclado Mecânico', price: 499.99, quantity: 2 },
    { id: 4, name: 'Mouse Gamer', price: 299.99, quantity: 15 },
    { id: 5, name: 'Headset Bluetooth', price: 399.99, quantity: 4 },
    { id: 6, name: 'SSD 1TB', price: 599.99, quantity: 6 },
    { id: 7, name: 'Memória RAM 16GB', price: 349.99, quantity: 1 },
    { id: 8, name: 'Placa de Vídeo RTX 3060', price: 2499.99, quantity: 0 }
  ];

  constructor() {}

  registerProduct(product: Product): Observable<Product> {
    const newProduct = {
      ...product,
      id: this.mockProducts.length + 1
    };
    this.mockProducts.push(newProduct);
    return of(newProduct);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedProduct = { ...product, id };
      this.mockProducts[index] = updatedProduct;
      return of(updatedProduct);
    }
    return of(product);
  }

  getProduct(id: number): Observable<Product> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product!);
  }

  getLowStockProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  deleteProduct(id: number): Observable<void> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
    }
    return of(void 0);
  }
} 