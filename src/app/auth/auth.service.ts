import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private apiUrl = 'http://localhost:3000/api'; // Update with your API URL

  constructor(private http: HttpClient) {
    // Load user from localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // Replace with actual API call when backend is ready
    // For now, we'll simulate a successful login
    return of({
      id: '1',
      name: 'Usuário Teste',
      email: email,
      token: 'fake-jwt-token'
    }).pipe(
      // Simulate network delay
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );

    // Uncomment when API is ready
    /*
    return this.http.post<User>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Falha na autenticação. Verifique suas credenciais.'));
        })
      );
    */
  }
  register(name: string, email: string, password: string, role: string): Observable<any> {
    // Replace with actual API call when backend is ready
    // For now, we'll simulate a successful registration
    return of({ success: true, name, email, role }).pipe(
      tap((result) => console.log('User registered successfully:', result))
    );

    // Uncomment when API is ready
    /*
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { name, email, password, role })
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error('Falha no registro. Tente novamente.'));
        })
      );
    */
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
