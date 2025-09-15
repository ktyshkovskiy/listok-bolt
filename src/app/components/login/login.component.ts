import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../models/auth.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Welcome to Listok</mat-card-title>
          <mat-card-subtitle>Sign in to manage your lists</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="login-buttons" *ngIf="(authState$ | async) as authState">
            <button 
              mat-raised-button 
              color="primary" 
              class="social-button google-button"
              [disabled]="authState.loading"
              (click)="signInWithGoogle()">
              <mat-icon>account_circle</mat-icon>
              Continue with Google
            </button>
            
            <button 
              mat-raised-button 
              color="accent" 
              class="social-button github-button"
              [disabled]="authState.loading"
              (click)="signInWithGitHub()">
              <mat-icon>code</mat-icon>
              Continue with GitHub
            </button>
            
            <button 
              mat-raised-button 
              class="social-button apple-button"
              [disabled]="authState.loading"
              (click)="signInWithApple()">
              <mat-icon>phone_iphone</mat-icon>
              Continue with Apple
            </button>
            
            <div class="loading-spinner" *ngIf="authState.loading">
              <mat-spinner diameter="30"></mat-spinner>
              <p>Signing you in...</p>
            </div>
            
            <div class="error-message" *ngIf="authState.error">
              <mat-icon color="warn">error</mat-icon>
              <p>{{ authState.error }}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }
    
    mat-card-header {
      text-align: center;
      margin-bottom: 24px;
    }
    
    mat-card-title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    mat-card-subtitle {
      font-size: 16px;
      opacity: 0.7;
    }
    
    .login-buttons {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .social-button {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
      text-transform: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    
    .google-button {
      background-color: #4285f4;
      color: white;
    }
    
    .github-button {
      background-color: #333;
      color: white;
    }
    
    .apple-button {
      background-color: #000;
      color: white;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #ffebee;
      border-radius: 8px;
      color: #c62828;
    }
    
    @media (max-width: 480px) {
      .login-card {
        margin: 0;
        padding: 20px;
      }
      
      .social-button {
        height: 44px;
        font-size: 14px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  authState$: Observable<AuthState>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authState$ = this.authService.authState$;
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    this.authState$.subscribe(state => {
      if (state.user && !state.loading) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async signInWithGoogle(): Promise<void> {
    await this.authService.signInWithGoogle();
  }

  async signInWithGitHub(): Promise<void> {
    await this.authService.signInWithGitHub();
  }

  async signInWithApple(): Promise<void> {
    await this.authService.signInWithApple();
  }
}