import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ProductService } from './services/product.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  providers: [ProductService],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/">Sistema de Estoque</a>
      </div>
      <div class="navbar-menu">
        <a routerLink="/products" class="nav-link">Produtos</a>
        @if (authService.isLoggedIn()) {
          <div class="auth-buttons">
            <span class="user-name">{{ getUserName() }}</span>
            <button class="btn-logout" (click)="logout()">Sair</button>
          </div>
        } @else {
          <div class="auth-buttons">
            <a routerLink="/auth/login" class="btn-login">Login</a>
            <a routerLink="/auth/register" class="btn-register">Registrar</a>
          </div>
        }
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f7fa;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #2c3e50;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-brand a {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      text-decoration: none;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }

    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .user-name {
      font-weight: 500;
      margin-right: 0.5rem;
    }

    .btn-login, .btn-register {
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .btn-login {
      color: white;
      
      &:hover {
        text-decoration: underline;
      }
    }

    .btn-register {
      background-color: #3498db;
      color: white;
      
      &:hover {
        background-color: #2980b9;
      }
    }

    .btn-logout {
      background-color: transparent;
      color: white;
      border: 1px solid white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      
      &:hover {
        background-color: white;
        color: #2c3e50;
      }
    }

    main {
      padding: 0;
    }
  `]
})
export class AppComponent {
  title = 'stock-front';

  constructor(public authService: AuthService) {}

  getUserName(): string {
    return this.authService.currentUserValue?.name || '';
  }

  logout(): void {
    this.authService.logout();
  }
}
