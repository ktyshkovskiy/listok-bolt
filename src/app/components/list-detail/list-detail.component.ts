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

interface ItemGroup {
  color: string | null;
  items: Item[];
}


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
  styleUrl: './list-detail.component.scss'
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
    return this.sortItemsByColor(
      this.list?.items.filter(item => item.status === 'to_buy') || []
    );
  }

  get itemsBoughtList(): Item[] {
    return this.sortItemsByColor(
      this.list?.items.filter(item => item.status === 'bought') || []
    );
  }

  get itemsToBuyGroups(): ItemGroup[] {
    return this.groupItemsByColor(this.itemsToBuyList);
  }

  get itemsBoughtGroups(): ItemGroup[] {
    return this.groupItemsByColor(this.itemsBoughtList);
  }

  private sortItemsByColor(items: Item[]): Item[] {
    return items.sort((a, b) => {
      const colorA = a.color || '';
      const colorB = b.color || '';

      // Items without color go to the end
      if (!colorA && colorB) return 1;
      if (colorA && !colorB) return -1;
      if (!colorA && !colorB) return 0;

      // Sort by color value
      return colorA.localeCompare(colorB);
    });
  }

  private groupItemsByColor(items: Item[]): ItemGroup[] {
    const groups: ItemGroup[] = [];
    let currentGroup: ItemGroup | null = null;

    items.forEach(item => {
      const color = item.color || null;

      if (!currentGroup || currentGroup.color !== color) {
        currentGroup = { color, items: [] };
        groups.push(currentGroup);
      }

      currentGroup.items.push(item);
    });

    return groups;
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
