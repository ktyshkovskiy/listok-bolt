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
  templateUrl: './list-create.component.html',
  styleUrls: ['./list-create.component.scss'],
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
      url: 'https://aa-business.co.uk/wp-content/uploads/2019/10/Stationery-Supplies-min-700x553.jpg'
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
