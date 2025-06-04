import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Produto' : 'Novo Produto' }}</h2>
          <button class="close-button" (click)="onCancel()">×</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #productForm="ngForm">
          <div class="form-group">
            <label for="name">Nome do Produto</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="product.name"
              required
              #name="ngModel"
              placeholder="Digite o nome do produto"
            >
            <div class="error-message" *ngIf="name.invalid && (name.dirty || name.touched)">
              Nome do produto é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="price">Preço</label>
            <div class="price-input">
              <span class="currency">R$</span>
              <input
                type="number"
                id="price"
                name="price"
                [(ngModel)]="product.price"
                required
                min="0"
                step="0.01"
                #price="ngModel"
                placeholder="0,00"
              >
            </div>
            <div class="error-message" *ngIf="price.invalid && (price.dirty || price.touched)">
              Preço válido é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="quantity">Quantidade em Estoque</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              [(ngModel)]="product.quantity"
              required
              min="0"
              #quantity="ngModel"
              placeholder="0"
            >
            <div class="error-message" *ngIf="quantity.invalid && (quantity.dirty || quantity.touched)">
              Quantidade válida é obrigatória
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="onCancel()">Cancelar</button>
            <button type="submit" class="btn-submit" [disabled]="productForm.invalid">
              {{ isEditing ? 'Salvar Alterações' : 'Adicionar Produto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: #2c2c2c;
      border-radius: 16px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.3s ease;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #b0b0b0;
      cursor: pointer;
      padding: 0.5rem;
      line-height: 1;
      transition: color 0.2s;
    }

    .close-button:hover {
      color: #dc3545;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #e0e0e0;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #555;
      border-radius: 8px;
      background-color: #3c3c3c;
      color: #e0e0e0;
      font-size: 1rem;
      transition: all 0.3s;
    }

    input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      outline: none;
    }

    .price-input {
      position: relative;
    }

    .currency {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #b0b0b0;
    }

    .price-input input {
      padding-left: 2.5rem;
    }

    .error-message {
      color: #ff7b72;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-cancel, .btn-submit {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      flex: 1;
    }

    .btn-cancel {
      background: #3c3c3c;
      border: 2px solid #555;
      color: #e0e0e0;
    }

    .btn-cancel:hover {
      background: #555;
    }

    .btn-submit {
      background: #007bff;
      border: none;
      color: white;
    }

    .btn-submit:hover {
      background: #0056b3;
    }

    .btn-submit:disabled {
      background: #5a6268;
      cursor: not-allowed;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  @Input() product: any = { name: '', price: 0, quantity: 0 };
  @Input() isEditing = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    if (this.isEditing) {
      this.product = { ...this.product };
    }
  }

  onSubmit() {
    if (this.product.name && this.product.price >= 0 && this.product.quantity >= 0) {
      if (this.isEditing) {
        this.productService.updateProduct(this.product.id!, this.product).subscribe(
          (response) => {
            this.save.emit(response);
          },
          (error) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
      } else {
        this.productService.registerProduct(this.product).subscribe(
          (response) => {
            this.save.emit(response);
          },
          (error) => {
            console.error('Erro ao registrar produto:', error);
          }
        );
      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 