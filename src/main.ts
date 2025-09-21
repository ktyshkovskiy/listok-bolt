import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';
import { Configuration } from './app/generated/api';
import { environment } from './environments/environment';

// Configure OpenAPI client
const apiConfiguration = new Configuration({
  basePath: environment.apiUrl,
  credentials: {
    OAuth2: () => localStorage.getItem('authToken') || undefined
  },
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
      <router-outlet></router-outlet>
  `
})
export class App {
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {provide: Configuration, useValue: apiConfiguration}
  ]
}).catch(err => console.error(err));
