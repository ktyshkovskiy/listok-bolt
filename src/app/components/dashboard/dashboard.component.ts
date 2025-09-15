import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { List, Item } from '../../models/list.model';
import { User } from '../../models/auth.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
        
        <span class="app-title">Listok</span>
        
        <span class="spacer"></span>
        
        <button mat-button [routerLink]="['/lists/new']" class="new-list-button">
          <mat-icon>add</mat-icon>
          New List
        </button>
        
        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-button">
          <img [src]="currentUser?.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'" 
               [alt]="currentUser?.displayName || 'User'" 
               class="user-avatar">
        </button>
        
        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <img [src]="currentUser?.photoURL || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'" 
                 [alt]="currentUser?.displayName || 'User'" 
                 class="user-avatar-large">
            <div>
              <p class="user-name">{{ currentUser?.displayName || 'User' }}</p>
              <p class="user-email">{{ currentUser?.email }}</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="signOut()">
            <mat-icon>logout</mat-icon>
            Sign Out
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <mat-nav-list>
            <a mat-list-item [routerLink]="['/dashboard']" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item [routerLink]="['/lists']" routerLinkActive="active">
              <mat-icon matListItemIcon>list</mat-icon>
              <span matListItemTitle>All Lists</span>
            </a>
            <a mat-list-item [routerLink]="['/lists/new']" routerLinkActive="active">
              <mat-icon matListItemIcon>add</mat-icon>
              <span matListItemTitle>Create List</span>
            </a>
            <mat-divider></mat-divider>
            <h3 matSubheader>Quick Stats</h3>
            <mat-list-item>
              <mat-icon matListItemIcon>assignment</mat-icon>
              <span matListItemTitle>Total Lists</span>
              <span matListItemMeta class="stat-badge">{{ totalLists }}</span>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>shopping_cart</mat-icon>
              <span matListItemTitle>Items to Buy</span>
              <span matListItemMeta class="stat-badge">{{ itemsToBuy }}</span>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>done</mat-icon>
              <span matListItemTitle>Items Bought</span>
              <span matListItemMeta class="stat-badge">{{ itemsBought }}</span>
            </mat-list-item>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <div class="content-container">
            <div class="welcome-section">
              <h1 class="page-title">Welcome back, {{ currentUser?.displayName || 'User' }}!</h1>
              <p class="page-subtitle">Here's an overview of your lists</p>
            </div>

            <div class="stats-grid" *ngIf="!loading">
              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-content">
                    <mat-icon class="stat-icon primary">assignment</mat-icon>
                    <div>
                      <h3 class="stat-number">{{ totalLists }}</h3>
                      <p class="stat-label">Total Lists</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-content">
                    <mat-icon class="stat-icon accent">shopping_cart</mat-icon>
                    <div>
                      <h3 class="stat-number">{{ itemsToBuy }}</h3>
                      <p class="stat-label">Items to Buy</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-content">
                    <mat-icon class="stat-icon success">done_all</mat-icon>
                    <div>
                      <h3 class="stat-number">{{ itemsBought }}</h3>
                      <p class="stat-label">Items Bought</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-content">
                    <mat-icon class="stat-icon info">percent</mat-icon>
                    <div>
                      <h3 class="stat-number">{{ completionRate }}%</h3>
                      <p class="stat-label">Completion Rate</p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="recent-lists-section" *ngIf="!loading">
              <h2 class="section-title">Recent Lists</h2>
              <div class="lists-grid">
                <mat-card 
                  *ngFor="let list of recentLists" 
                  class="list-card"
                  (click)="openList(list.id)">
                  <div class="list-image" [style.background-image]="'url(' + (list.img || 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg') + ')'">
                    <div class="list-overlay">
                      <h3 class="list-title">{{ list.name }}</h3>
                    </div>
                  </div>
                  <mat-card-content>
                    <p class="list-comment" *ngIf="list.comment">{{ list.comment }}</p>
                    <div class="list-stats">
                      <mat-chip-set aria-label="List statistics">
                        <mat-chip-option [disabled]="true">
                          <mat-icon>assignment</mat-icon>
                          {{ list.items.length }} items
                        </mat-chip-option>
                        <mat-chip-option [disabled]="true" *ngIf="getListItemsToBuy(list) > 0">
                          <mat-icon>shopping_cart</mat-icon>
                          {{ getListItemsToBuy(list) }} to buy
                        </mat-chip-option>
                        <mat-chip-option [disabled]="true" *ngIf="getListItemsBought(list) > 0">
                          <mat-icon>done</mat-icon>
                          {{ getListItemsBought(list) }} done
                        </mat-chip-option>
                      </mat-chip-set>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button color="primary" (click)="$event.stopPropagation(); openList(list.id)">
                      <mat-icon>open_in_new</mat-icon>
                      View
                    </button>
                    <button mat-button (click)="$event.stopPropagation(); editList(list.id)">
                      <mat-icon>edit</mat-icon>
                      Edit
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>

              <div class="no-lists" *ngIf="totalLists === 0">
                <mat-icon class="empty-icon">assignment</mat-icon>
                <h3>No lists yet</h3>
                <p>Create your first list to get started</p>
                <button mat-raised-button color="primary" [routerLink]="['/lists/new']">
                  <mat-icon>add</mat-icon>
                  Create Your First List
                </button>
              </div>
            </div>

            <div class="loading-container" *ngIf="loading">
              <mat-spinner diameter="50"></mat-spinner>
              <p>Loading your dashboard...</p>
            </div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .app-title {
      font-size: 20px;
      font-weight: 600;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .new-list-button {
      margin-right: 16px;
    }

    .user-button {
      padding: 4px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-avatar-large {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }

    .user-name {
      font-weight: 600;
      margin: 0;
    }

    .user-email {
      font-size: 14px;
      opacity: 0.7;
      margin: 0;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 280px;
      padding: 0;
    }

    .sidenav mat-nav-list {
      padding-top: 0;
    }

    .sidenav a.active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .stat-badge {
      background-color: #1976d2;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .main-content {
      background-color: #fafafa;
    }

    .content-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1976d2;
    }

    .page-subtitle {
      font-size: 16px;
      opacity: 0.7;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.primary {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .stat-icon.accent {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .stat-icon.success {
      background-color: #e8f5e8;
      color: #4caf50;
    }

    .stat-icon.info {
      background-color: #f3e5f5;
      color: #9c27b0;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      color: #333;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.7;
      margin: 0;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #333;
    }

    .lists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .list-card {
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .list-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .list-image {
      height: 160px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .list-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
      padding: 16px;
    }

    .list-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .list-comment {
      font-size: 14px;
      opacity: 0.7;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }

    .list-stats {
      margin-bottom: 8px;
    }

    .list-stats mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .list-stats mat-chip {
      font-size: 12px;
    }

    .no-lists {
      text-align: center;
      padding: 40px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .no-lists h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
    }

    .no-lists p {
      margin: 0 0 24px 0;
      opacity: 0.7;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 240px;
      }
      
      .content-container {
        padding: 16px;
      }
      
      .page-title {
        font-size: 24px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }
      
      .lists-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  lists$ = new BehaviorSubject<List[]>([]);
  loading = true;
  currentUser: User | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
      if (!state.user && !state.loading) {
        this.router.navigate(['/login']);
      }
    });

    this.loadLists();
  }

  loadLists(): void {
    this.loading = true;
    this.apiService.getLists().subscribe({
      next: (lists) => {
        this.lists$.next(lists);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading lists:', error);
        this.loading = false;
      }
    });
  }

  get totalLists(): number {
    return this.lists$.value.length;
  }

  get itemsToBuy(): number {
    return this.lists$.value.reduce((count, list) => 
      count + list.items.filter(item => item.status === 'to_buy').length, 0);
  }

  get itemsBought(): number {
    return this.lists$.value.reduce((count, list) => 
      count + list.items.filter(item => item.status === 'bought').length, 0);
  }

  get totalItems(): number {
    return this.lists$.value.reduce((count, list) => count + list.items.length, 0);
  }

  get completionRate(): number {
    const total = this.totalItems;
    if (total === 0) return 0;
    return Math.round((this.itemsBought / total) * 100);
  }

  get recentLists(): List[] {
    return this.lists$.value.slice(0, 6);
  }

  getListItemsToBuy(list: List): number {
    return list.items.filter(item => item.status === 'to_buy').length;
  }

  getListItemsBought(list: List): number {
    return list.items.filter(item => item.status === 'bought').length;
  }

  openList(listId: string): void {
    this.router.navigate(['/lists', listId]);
  }

  editList(listId: string): void {
    this.router.navigate(['/lists', listId, 'edit']);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}