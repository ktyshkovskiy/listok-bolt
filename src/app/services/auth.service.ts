import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthState } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    user: null,
    loading: false,
    error: null
  });

  public authState$ = this.authState.asObservable();

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    // For development/mock mode, simulate a logged-in user
    if (environment.useMockData) {
      const mockUser: User = {
        uid: 'mock-user-123',
        email: 'user@example.com',
        displayName: 'Demo User',
        photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        providerId: 'mock'
      };
      this.authState.next({
        user: mockUser,
        loading: false,
        error: null
      });
      localStorage.setItem('authToken', 'mock-token-123');
    } else {
      // In production, check for actual auth state
      const token = localStorage.getItem('authToken');
      if (token) {
        // Validate token and get user info
        this.validateToken(token);
      }
    }
  }

  private validateToken(token: string): void {
    // In production, validate the token with your auth provider
    // For now, this is a placeholder
  }

  async signInWithGoogle(): Promise<void> {
    this.authState.next({ ...this.authState.value, loading: true, error: null });
    
    try {
      if (environment.useMockData) {
        // Mock Google sign-in
        const mockUser: User = {
          uid: 'google-user-123',
          email: 'user@gmail.com',
          displayName: 'Google User',
          photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          providerId: 'google.com'
        };
        localStorage.setItem('authToken', 'google-token-123');
        this.authState.next({ user: mockUser, loading: false, error: null });
      } else {
        // Implement actual Google sign-in using Firebase Auth
        // const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
        // Handle the result
      }
    } catch (error: any) {
      this.authState.next({
        ...this.authState.value,
        loading: false,
        error: error.message
      });
    }
  }

  async signInWithGitHub(): Promise<void> {
    this.authState.next({ ...this.authState.value, loading: true, error: null });
    
    try {
      if (environment.useMockData) {
        // Mock GitHub sign-in
        const mockUser: User = {
          uid: 'github-user-123',
          email: 'user@github.com',
          displayName: 'GitHub User',
          photoURL: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
          providerId: 'github.com'
        };
        localStorage.setItem('authToken', 'github-token-123');
        this.authState.next({ user: mockUser, loading: false, error: null });
      } else {
        // Implement actual GitHub sign-in using Firebase Auth
        // const result = await signInWithPopup(this.auth, new GithubAuthProvider());
        // Handle the result
      }
    } catch (error: any) {
      this.authState.next({
        ...this.authState.value,
        loading: false,
        error: error.message
      });
    }
  }

  async signInWithApple(): Promise<void> {
    this.authState.next({ ...this.authState.value, loading: true, error: null });
    
    try {
      if (environment.useMockData) {
        // Mock Apple sign-in
        const mockUser: User = {
          uid: 'apple-user-123',
          email: 'user@icloud.com',
          displayName: 'Apple User',
          photoURL: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
          providerId: 'apple.com'
        };
        localStorage.setItem('authToken', 'apple-token-123');
        this.authState.next({ user: mockUser, loading: false, error: null });
      } else {
        // Implement actual Apple sign-in using Firebase Auth
        // const result = await signInWithPopup(this.auth, new OAuthProvider('apple.com'));
        // Handle the result
      }
    } catch (error: any) {
      this.authState.next({
        ...this.authState.value,
        loading: false,
        error: error.message
      });
    }
  }

  async signOut(): Promise<void> {
    this.authState.next({ ...this.authState.value, loading: true });
    
    try {
      localStorage.removeItem('authToken');
      this.authState.next({ user: null, loading: false, error: null });
    } catch (error: any) {
      this.authState.next({
        ...this.authState.value,
        loading: false,
        error: error.message
      });
    }
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  isAuthenticated(): boolean {
    return !!this.authState.value.user;
  }
}