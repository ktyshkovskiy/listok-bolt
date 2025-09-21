import { Observable } from "rxjs";
import { AuthState } from "../models/auth.model";

export interface AuthServiceInterface {
  authState$: Observable<AuthState>;
  signInWithGoogle(): Promise<void>;
  signInWithGitHub(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
}
