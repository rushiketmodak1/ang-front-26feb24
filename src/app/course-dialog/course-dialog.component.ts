import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseDialogData
  ) {}

  

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    this.dialogRef.close(this.data);
  }
}
export interface CourseDialogData {
  id?: number;
  name: string;
  imagePath: string;
  description: string;
}
