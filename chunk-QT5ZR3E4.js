import {
  environment
} from "./chunk-WO6GHJVH.js";
import {
  BehaviorSubject,
  Injectable,
  __async,
  __name,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-2D7222YK.js";

// src/app/services/auth.service.ts
var _AuthService = class _AuthService {
  constructor() {
    this.authState = new BehaviorSubject({
      user: null,
      loading: false,
      error: null
    });
    this.authState$ = this.authState.asObservable();
    this.checkAuthState();
  }
  checkAuthState() {
    if (environment.useMockData) {
      const mockUser = {
        uid: "mock-user-123",
        email: "user@example.com",
        displayName: "Demo User",
        photoURL: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        providerId: "mock"
      };
      this.authState.next({
        user: mockUser,
        loading: false,
        error: null
      });
      localStorage.setItem("authToken", "mock-token-123");
    } else {
      const token = localStorage.getItem("authToken");
      if (token) {
        this.validateToken(token);
      }
    }
  }
  validateToken(token) {
  }
  signInWithGoogle() {
    return __async(this, null, function* () {
      this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), { loading: true, error: null }));
      try {
        if (environment.useMockData) {
          const mockUser = {
            uid: "google-user-123",
            email: "user@gmail.com",
            displayName: "Google User",
            photoURL: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
            providerId: "google.com"
          };
          localStorage.setItem("authToken", "google-token-123");
          this.authState.next({ user: mockUser, loading: false, error: null });
        } else {
        }
      } catch (error) {
        this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), {
          loading: false,
          error: error.message
        }));
      }
    });
  }
  signInWithGitHub() {
    return __async(this, null, function* () {
      this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), { loading: true, error: null }));
      try {
        if (environment.useMockData) {
          const mockUser = {
            uid: "github-user-123",
            email: "user@github.com",
            displayName: "GitHub User",
            photoURL: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
            providerId: "github.com"
          };
          localStorage.setItem("authToken", "github-token-123");
          this.authState.next({ user: mockUser, loading: false, error: null });
        } else {
        }
      } catch (error) {
        this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), {
          loading: false,
          error: error.message
        }));
      }
    });
  }
  signInWithApple() {
    return __async(this, null, function* () {
      this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), { loading: true, error: null }));
      try {
        if (environment.useMockData) {
          const mockUser = {
            uid: "apple-user-123",
            email: "user@icloud.com",
            displayName: "Apple User",
            photoURL: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
            providerId: "apple.com"
          };
          localStorage.setItem("authToken", "apple-token-123");
          this.authState.next({ user: mockUser, loading: false, error: null });
        } else {
        }
      } catch (error) {
        this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), {
          loading: false,
          error: error.message
        }));
      }
    });
  }
  signOut() {
    return __async(this, null, function* () {
      this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), { loading: true }));
      try {
        localStorage.removeItem("authToken");
        this.authState.next({ user: null, loading: false, error: null });
      } catch (error) {
        this.authState.next(__spreadProps(__spreadValues({}, this.authState.value), {
          loading: false,
          error: error.message
        }));
      }
    });
  }
  getCurrentUser() {
    return this.authState.value.user;
  }
  isAuthenticated() {
    return !!this.authState.value.user;
  }
};
__name(_AuthService, "AuthService");
_AuthService.\u0275fac = /* @__PURE__ */ __name(function AuthService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AuthService)();
}, "AuthService_Factory");
_AuthService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
var AuthService = _AuthService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-QT5ZR3E4.js.map
