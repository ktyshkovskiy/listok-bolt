import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    map(state => {
      if (state.user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};