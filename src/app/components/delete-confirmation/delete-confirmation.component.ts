import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Confirmar Exclusão</h2>
          <button class="close-button" (click)="onCancel()">×</button>
        </div>
        <p class="confirmation-message">Tem certeza que deseja excluir o produto <strong>{{ productName }}</strong>?</p>
        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="onCancel()">Cancelar</button>
          <button type="button" class="btn-delete" (click)="onConfirm()">Excluir</button>
        </div>
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
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.3s ease;
      text-align: center;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #ffffff;
      font-size: 1.25rem;
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

    .confirmation-message {
      color: #e0e0e0;
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .confirmation-message strong {
        color: #ffffff;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-cancel, .btn-delete {
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

    .btn-delete {
      background: #dc3545;
      border: none;
      color: white;
    }

    .btn-delete:hover {
      background: #c82333;
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
export class DeleteConfirmationComponent {
  @Input() productName = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
} 