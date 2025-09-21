import { Injectable } from '@angular/core';
import { AuthState, User } from '../models/auth.model';
import { BehaviorSubject } from "rxjs";
import { AuthServiceInterface } from "../services/auth.service.interface";

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

  async signInWithGoogle(): Promise<void> {
    this._authState.next({...this._authState.value, loading: true, error: null});

    const mockUser: User = {
      uid: 'google-user-123',
      email: 'user@gmail.com',
      displayName: 'Google User',
      photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      providerId: 'google.com'
    };
    localStorage.setItem('authToken', 'google-token-123');
    this._authState.next({user: mockUser, loading: false, error: null});
  }

  async signInWithGitHub(): Promise<void> {
    this._authState.next({...this._authState.value, loading: true, error: null});

    const mockUser: User = {
      uid: 'github-user-123',
      email: 'user@github.com',
      displayName: 'GitHub User',
      photoURL: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      providerId: 'github.com'
    };
    localStorage.setItem('authToken', 'github-token-123');
    this._authState.next({user: mockUser, loading: false, error: null});
  }

  async signInWithApple(): Promise<void> {
    this._authState.next({...this._authState.value, loading: true, error: null});

    const mockUser: User = {
      uid: 'apple-user-123',
      email: 'user@icloud.com',
      displayName: 'Apple User',
      photoURL: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      providerId: 'apple.com'
    };
    localStorage.setItem('authToken', 'apple-token-123');
    this._authState.next({user: mockUser, loading: false, error: null});
  }

  async signOut(): Promise<void> {
    this._authState.next({...this._authState.value, loading: true});

    try {
      localStorage.removeItem('authToken');
      this._authState.next({user: null, loading: false, error: null});
    } catch (error: any) {
      this._authState.next({
        ...this._authState.value,
        loading: false,
        error: error.message
      });
    }
  }
}
