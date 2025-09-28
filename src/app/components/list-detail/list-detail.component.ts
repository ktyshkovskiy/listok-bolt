import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subject, takeUntil } from 'rxjs';
import { Item, ItemStatus, List } from '../../models/list.model';
import { ItemService } from "../../services/item.service";
import { ListService } from "../../services/list.service";

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatToolbarModule,
    RouterModule
  ],
  templateUrl: './list-detail.component.html',
  styles: [`
    .list-detail-container {
      min-height: 100vh;
      background-color: #fafafa;
    }

    .list-toolbar {
      background-color: white;
      color: #333;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .list-header-info {
      flex: 1;
      margin-left: 16px;
    }

    .list-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .list-subtitle {
      font-size: 14px;
      opacity: 0.7;
      margin: 0;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .list-content {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .list-hero {
      margin-bottom: 24px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .list-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .list-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      border-radius: 8px;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .stat-icon.to-buy {
      color: #f57c00;
    }

    .stat-icon.bought {
      color: #4caf50;
    }

    .stat-icon.progress {
      color: #9c27b0;
    }

    .stat-content h3 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .stat-content p {
      font-size: 14px;
      opacity: 0.7;
      margin: 0;
    }

    .items-section {
      background-color: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      flex: 1;
    }

    .item-count-badge {
      background-color: #1976d2;
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }

    .item-count-badge.completed {
      background-color: #4caf50;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }

    .item-card {
      border-radius: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .item-card.bought {
      opacity: 0.6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      background-color: #f5f5f5;
      pointer-events: auto;
    }

    .item-card.bought:hover {
      transform: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }

    .bought-text {
      text-decoration: line-through;
      color: #999;
    }

    .item-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .item-checkbox {
      flex-shrink: 0;
    }

    .item-image {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .item-comment {
      font-size: 14px;
      opacity: 0.7;
      margin: 0;
    }

    .item-menu-button {
      flex-shrink: 0;
    }

    .item-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }

    .item-count {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }

    .item-color {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .color-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #ddd;
    }

    .item-status {
      margin-left: auto;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      opacity: 0.7;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 16px;
    }

    .delete-button {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .list-content {
        padding: 16px;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .items-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .item-header {
        flex-wrap: wrap;
        gap: 8px;
      }

      .item-details {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
    }
  `]
})
export class ListDetailComponent implements OnInit, OnDestroy {
  list: List | null = null;
  loading = true;

  private destroy$ = new Subject<void>();

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private apiItemService: ItemService = inject(ItemService);
  private apiListService: ListService = inject(ListService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.loadList(params['id']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadList(id: string): void {
    this.loading = true;
    this.apiListService.getListById(id).subscribe({
      next: (list) => {
        this.list = list;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading list:', error);
        this.snackBar.open('Error loading list', 'Close', {duration: 3000});
        this.loading = false;
      }
    });
  }

  get itemsToBuy(): number {
    return this.list?.items.filter(item => item.status === 'to_buy').length || 0;
  }

  get itemsBought(): number {
    return this.list?.items.filter(item => item.status === 'bought').length || 0;
  }

  get completionRate(): number {
    if (!this.list || this.list.items.length === 0) return 0;
    return Math.round((this.itemsBought / this.list.items.length) * 100);
  }

  get itemsToBuyList(): Item[] {
    return this.list?.items.filter(item => item.status === 'to_buy') || [];
  }

  get itemsBoughtList(): Item[] {
    return this.list?.items.filter(item => item.status === 'bought') || [];
  }

  toggleItemStatus(item: Item): void {
    const newStatus = item.status === ItemStatus.Bought ? ItemStatus.ToBuy : ItemStatus.Bought;
    this.apiItemService.updateItem(item.id, {status: newStatus}).subscribe({
      next: (updatedItem) => {
        if (this.list && updatedItem) {
          const index = this.list.items.findIndex(i => i.id === item.id);
          if (index !== -1) {
            this.list.items[index] = updatedItem;
          }
        }
        this.snackBar.open(
          `Item marked as ${item.status === ItemStatus.Bought ? 'bought' : 'to buy'}`,
          'Close',
          {duration: 2000}
        );
      },
      error: (error) => {
        console.error('Error updating item:', error);
        this.snackBar.open('Error updating item', 'Close', {duration: 3000});
      }
    });
  }

  editItem(item: Item): void {
    this.router.navigate(['/items', item.id, 'edit']);
  }

  deleteItem(item: Item): void {
    if (confirm(`Are you sure you want to delete "${item.item.name}"?`)) {
      this.apiItemService.deleteItem(item.id).subscribe({
        next: () => {
          if (this.list) {
            this.list.items = this.list.items.filter(i => i.id !== item.id);
          }
          this.snackBar.open('Item deleted successfully', 'Close', {duration: 2000});
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          this.snackBar.open('Error deleting item', 'Close', {duration: 3000});
        }
      });
    }
  }

  deleteList(): void {
    if (!this.list) return;

    if (confirm(`Are you sure you want to delete "${this.list.name}"?`)) {
      this.apiListService.deleteList(this.list.id).subscribe({
        next: () => {
          this.snackBar.open('List deleted successfully', 'Close', {duration: 2000});
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error deleting list:', error);
          this.snackBar.open('Error deleting list', 'Close', {duration: 3000});
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
