import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AuthState } from "../models/auth.model";
import { AuthServiceInterface } from "./auth.service.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthServiceInterface {

  private _authState = new BehaviorSubject<AuthState>({
    user: null,
    loading: false,
    error: null
  });

  authState$ = this._authState.asObservable();

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    // In production, check for actual auth state
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token and get user info
      this.validateToken(token);
    }
  }

  private validateToken(token: string): void {
    // In production, validate the token with your auth provider
    // For now, this is a placeholder
  }

  async signInWithGoogle(): Promise<void> {
    this._authState.next({ ...this._authState.value, loading: true, error: null });
    
    try {
      // Implement actual Google sign-in using Firebase Auth
      // const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      // Handle the result
    } catch (error: any) {
      this._authState.next({
        ...this._authState.value,
        loading: false,
        error: error.message
      });
    }
  }

  async signInWithGitHub(): Promise<void> {
    this._authState.next({ ...this._authState.value, loading: true, error: null });
    
    try {
      // Implement actual GitHub sign-in using Firebase Auth
      // const result = await signInWithPopup(this.auth, new GithubAuthProvider());
      // Handle the result
    } catch (error: any) {
      this._authState.next({
        ...this._authState.value,
        loading: false,
        error: error.message
      });
    }
  }

  async signInWithApple(): Promise<void> {
    this._authState.next({ ...this._authState.value, loading: true, error: null });
    
    try {
      // Implement actual Apple sign-in using Firebase Auth
      // const result = await signInWithPopup(this.auth, new OAuthProvider('apple.com'));
      // Handle the result
    } catch (error: any) {
      this._authState.next({
        ...this._authState.value,
        loading: false,
        error: error.message
      });
    }
  }

  async signOut(): Promise<void> {
    this._authState.next({ ...this._authState.value, loading: true });

    try {
      localStorage.removeItem('authToken');
      this._authState.next({ user: null, loading: false, error: null });
    } catch (error: any) {
      this._authState.next({
        ...this._authState.value,
        loading: false,
        error: error.message
      });
    }
  }
}
