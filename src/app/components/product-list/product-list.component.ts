import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent, DeleteConfirmationComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Controle de Estoque</h1>
          <p class="subtitle">Gerencie seus produtos de forma eficiente</p>
        </div>
        <button class="btn-add" (click)="addProduct()">
          <i class="fas fa-plus"></i>
          Novo Produto
        </button>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-info">
            <h3>Total de Produtos</h3>
            <p>{{ totalProducts }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-info">
            <h3>Produtos com Estoque Baixo</h3>
            <p>{{ lowStockProducts }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <h3>Produtos em Estoque</h3>
            <p>{{ inStockProducts }}</p>
          </div>
        </div>
      </div>

      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            placeholder="Buscar produtos..."
          >
        </div>
        <button 
          class="btn-filter" 
          [class.active]="showLowStock"
          (click)="toggleLowStock()"
        >
          <i class="fas fa-filter"></i>
          {{ showLowStock ? 'Mostrar Todos' : 'Estoque Baixo' }}
        </button>
      </div>

      <div class="products-grid">
        <div *ngFor="let product of filteredProducts" class="product-card">
          <div class="product-header">
            <h3>{{ product.name }}</h3>
            <span class="badge" [class.low-stock]="product.quantity < 5">
              {{ product.quantity < 5 ? 'Estoque Baixo' : 'Em Estoque' }}
            </span>
          </div>
          <div class="product-details">
            <div class="detail-item">
              <i class="fas fa-tag"></i>
              <span>R$ {{ product.price.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-boxes"></i>
              <span>{{ product.quantity }} unidades</span>
            </div>
          </div>
          <div class="product-actions">
            <button class="btn-edit" (click)="editProduct(product)">
              <i class="fas fa-edit"></i>
              Editar
            </button>
            <button class="btn-delete" (click)="confirmDelete(product)">
              <i class="fas fa-trash"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <app-product-form
      *ngIf="showForm"
      [product]="selectedProduct"
      [isEditing]="isEditing"
      (save)="onSaveProduct($event)"
      (cancel)="onCancelForm()"
    ></app-product-form>

    <app-delete-confirmation
      *ngIf="showDeleteConfirmation"
      [productName]="productToDelete?.name || ''"
      (confirm)="deleteProduct()"
      (cancel)="onCancelDelete()"
    ></app-delete-confirmation>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background-color: #1e1e1e;
      color: #e0e0e0;
      min-height: 100vh;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-content h1 {
      color: #ffffff;
      font-size: 2rem;
      margin: 0;
      font-weight: 700;
    }

    .subtitle {
      color: #b0b0b0;
      margin: 0.5rem 0 0;
    }

    .btn-add {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }

    .btn-add:hover {
      background: #0056b3;
      transform: translateY(-2px);
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #2c2c2c;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #007bff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.warning {
      background: #ffc107;
    }

    .stat-icon.success {
      background: #28a745;
    }

    .stat-info h3 {
      color: #b0b0b0;
      font-size: 0.875rem;
      margin: 0;
      font-weight: 500;
    }

    .stat-info p {
      color: #ffffff;
      font-size: 1.5rem;
      margin: 0.25rem 0 0;
      font-weight: 600;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-box {
      flex: 1;
      position: relative;
    }

    .search-box i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #b0b0b0;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #555;
      border-radius: 8px;
      background-color: #3c3c3c;
      color: #e0e0e0;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .search-box input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      outline: none;
    }

    .btn-filter {
      background: #3c3c3c;
      border: 2px solid #555;
      color: #e0e0e0;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }

    .btn-filter:hover {
      border-color: #007bff;
      color: #007bff;
    }

    .btn-filter.active {
      background: #007bff;
      border-color: #007bff;
      color: white;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      background: #2c2c2c;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      transition: all 0.3s;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .product-header h3 {
      margin: 0;
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .badge {
      background: #28a745;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .badge.low-stock {
      background: #dc3545;
    }

    .product-details {
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #b0b0b0;
      margin-bottom: 0.5rem;
    }

    .detail-item i {
      width: 20px;
      color: #b0b0b0;
    }

    .product-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-edit, .btn-delete {
      flex: 1;
      padding: 0.5rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }

    .btn-edit {
      background: #3c3c3c;
      border: 2px solid #555;
      color: #e0e0e0;
    }

    .btn-edit:hover {
      background: #007bff;
      border-color: #007bff;
      color: white;
    }

    .btn-delete {
      background: #dc3545;
      border: 2px solid #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background: #c82333;
      border-color: #c82333;
      color: white;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .dashboard-stats {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm = '';
  showLowStock = false;
  showForm = false;
  isEditing = false;
  selectedProduct: any = {};
  showDeleteConfirmation = false;
  productToDelete: any = null;

  get totalProducts(): number {
    return this.products.length;
  }

  get lowStockProducts(): number {
    return this.products.filter(p => p.quantity < 5).length;
  }

  get inStockProducts(): number {
    return this.products.filter(p => p.quantity > 0).length;
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getLowStockProducts().subscribe(products => {
      this.products = products;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStock = !this.showLowStock || product.quantity < 5;
      return matchesSearch && matchesStock;
    });
  }

  toggleLowStock() {
    this.showLowStock = !this.showLowStock;
    this.applyFilters();
  }

  addProduct() {
    this.isEditing = false;
    this.selectedProduct = { name: '', price: 0, quantity: 0 };
    this.showForm = true;
  }

  editProduct(product: any) {
    this.isEditing = true;
    this.selectedProduct = { ...product };
    this.showForm = true;
  }

  confirmDelete(product: any) {
    this.productToDelete = product;
    this.showDeleteConfirmation = true;
  }

  deleteProduct() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id!).subscribe(() => {
        this.loadProducts();
        this.onCancelDelete();
      });
    }
  }

  onCancelDelete() {
    this.showDeleteConfirmation = false;
    this.productToDelete = null;
  }

  onSaveProduct(product: any) {
    if (this.isEditing) {
      this.productService.updateProduct(product.id!, product).subscribe(() => {
        this.loadProducts();
        this.showForm = false;
      });
    } else {
      this.productService.registerProduct(product).subscribe(() => {
        this.loadProducts();
        this.showForm = false;
      });
    }
  }

  onCancelForm() {
    this.showForm = false;
  }
} 