import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-list-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="create-list-container">
      <mat-toolbar class="create-toolbar">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        
        <span class="toolbar-title">Create New List</span>
        
        <span class="spacer"></span>
        
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="!listForm.valid || isSubmitting"
          (click)="createList()">
          <mat-icon *ngIf="!isSubmitting">save</mat-icon>
          <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
          {{ isSubmitting ? 'Creating...' : 'Create List' }}
        </button>
      </mat-toolbar>

      <div class="create-content">
        <mat-card class="create-card">
          <mat-card-header>
            <mat-card-title>List Details</mat-card-title>
            <mat-card-subtitle>Fill in the information for your new list</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="listForm" class="list-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>List Name</mat-label>
                <input 
                  matInput 
                  formControlName="name" 
                  placeholder="Enter list name"
                  maxlength="100">
                <mat-icon matSuffix>list</mat-icon>
                <mat-error *ngIf="listForm.get('name')?.hasError('required')">
                  List name is required
                </mat-error>
                <mat-error *ngIf="listForm.get('name')?.hasError('minlength')">
                  List name must be at least 2 characters long
                </mat-error>
                <mat-hint align="end">{{ listForm.get('name')?.value?.length || 0 }}/100</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description (Optional)</mat-label>
                <textarea 
                  matInput 
                  formControlName="comment" 
                  placeholder="Add a description for your list"
                  rows="3"
                  maxlength="500">
                </textarea>
                <mat-icon matSuffix>description</mat-icon>
                <mat-hint align="end">{{ listForm.get('comment')?.value?.length || 0 }}/500</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Image URL (Optional)</mat-label>
                <input 
                  matInput 
                  formControlName="img" 
                  placeholder="https://example.com/image.jpg"
                  type="url">
                <mat-icon matSuffix>image</mat-icon>
                <mat-error *ngIf="listForm.get('img')?.hasError('pattern')">
                  Please enter a valid URL
                </mat-error>
              </mat-form-field>

              <div class="image-preview" *ngIf="imagePreviewUrl">
                <h4>Image Preview:</h4>
                <img [src]="imagePreviewUrl" [alt]="listForm.get('name')?.value" class="preview-image">
              </div>

              <div class="suggested-images">
                <h4>Or choose from suggested images:</h4>
                <div class="image-grid">
                  <div 
                    *ngFor="let image of suggestedImages" 
                    class="image-option"
                    [class.selected]="listForm.get('img')?.value === image.url"
                    (click)="selectImage(image.url)">
                    <img [src]="image.url" [alt]="image.name">
                    <span class="image-label">{{ image.name }}</span>
                  </div>
                </div>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <div class="action-buttons">
          <button mat-button (click)="goBack()" [disabled]="isSubmitting">
            Cancel
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            [disabled]="!listForm.valid || isSubmitting"
            (click)="createList()">
            <mat-icon *ngIf="!isSubmitting">add</mat-icon>
            <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
            {{ isSubmitting ? 'Creating List...' : 'Create List' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-list-container {
      min-height: 100vh;
      background-color: #fafafa;
    }

    .create-toolbar {
      background-color: white;
      color: #333;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .toolbar-title {
      font-size: 20px;
      font-weight: 600;
      margin-left: 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .create-content {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .create-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
    }

    .list-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 16px;
    }

    .full-width {
      width: 100%;
    }

    .image-preview {
      margin-top: 16px;
    }

    .image-preview h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .preview-image {
      width: 100%;
      max-width: 400px;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .suggested-images {
      margin-top: 24px;
    }

    .suggested-images h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }

    .image-option {
      cursor: pointer;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
    }

    .image-option:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .image-option.selected {
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }

    .image-option img {
      width: 100%;
      height: 100px;
      object-fit: cover;
    }

    .image-label {
      display: block;
      padding: 8px;
      font-size: 12px;
      text-align: center;
      background-color: white;
      border-top: 1px solid #eee;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding: 16px 0;
    }

    @media (max-width: 768px) {
      .create-content {
        padding: 16px;
      }

      .toolbar-title {
        font-size: 18px;
      }

      .image-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 8px;
      }

      .action-buttons {
        flex-direction: column-reverse;
      }

      .action-buttons button {
        width: 100%;
      }
    }
  `]
})
export class ListCreateComponent implements OnInit {
  listForm!: FormGroup;
  isSubmitting = false;
  imagePreviewUrl = '';

  suggestedImages = [
    {
      name: 'Groceries',
      url: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'
    },
    {
      name: 'Shopping',
      url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'
    },
    {
      name: 'Office Supplies',
      url: 'https://images.pexels.com/photos/159832/office-supplies-stationery-equipment-159832.jpeg'
    },
    {
      name: 'Home & Garden',
      url: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg'
    },
    {
      name: 'Books',
      url: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg'
    },
    {
      name: 'Travel',
      url: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg'
    }
  ];

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private listService: ListService = inject(ListService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.initializeForm();
    this.setupImagePreview();
  }

  private initializeForm(): void {
    this.listForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      comment: [''],
      img: ['', [Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)]]
    });
  }

  private setupImagePreview(): void {
    this.listForm.get('img')?.valueChanges.subscribe(url => {
      if (url && this.listForm.get('img')?.valid) {
        this.imagePreviewUrl = url;
      } else {
        this.imagePreviewUrl = '';
      }
    });
  }

  selectImage(url: string): void {
    this.listForm.patchValue({ img: url });
  }

  createList(): void {
    if (this.listForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const listData = {
        name: this.listForm.value.name.trim(),
        comment: this.listForm.value.comment?.trim() || undefined,
        img: this.listForm.value.img?.trim() || undefined
      };

      this.listService.createList(listData).subscribe({
        next: (createdList) => {
          this.snackBar.open('List created successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/lists', createdList.id]);
        },
        error: (error) => {
          console.error('Error creating list:', error);
          this.snackBar.open('Error creating list. Please try again.', 'Close', {
            duration: 5000
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}