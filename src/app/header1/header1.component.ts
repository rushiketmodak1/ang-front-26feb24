

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent, CourseDialogData } from '../course-dialog/course-dialog.component';
import { CourseService } from '../course.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.css']
})
export class Header1Component implements OnInit{
  
  submittedData: CourseDialogData[] = [];
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCourses();
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

  fetchCourses(): void {

    this.courseService.getAllCourses().subscribe(courses => {
      this.submittedData = courses;
    });
  }



  // ngOnInit(): void {
  //   this.userSub = this.authService.user.subscribe(user => {
  //     this.isAuthenticated = !!user;
  //     if (user) {
  //       this.fetchCourses(parseInt(user.id, 10)); 
  //     } else {
  //       this.submittedData = []; 
  //     }
  //   });
  // }

  // fetchCourses(userId: number): void {
  //   this.courseService.getCoursesByUserId(userId).subscribe(courses => {
  //     this.submittedData = courses;
  //   });
  // }

  // ngOnInit() {
  //   this.userSub = this.authService.user.subscribe(user => {
  //     this.isAuthenticated = !!user;
  //     console.log(!user);
  //     console.log(!!user);
  //   });
  // }

  onLogout() {
    this.authService.logout();
  }

  openAddCourseDialog(courseData?: CourseDialogData): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: courseData ? { ...courseData } : { name: '', imagePath: '', description: '' }
    });

    // Handling dialog close event
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (courseData) {
          // If courseData is provided, it's an update operation
          this.courseService.updateCourse(result).subscribe(updatedCourse => {
            // Find the index of the updated course in the submittedData array
            const index = this.submittedData.findIndex(item => item === courseData);
            if (index !== -1) {
              // Replace the old course with the updated one
              this.submittedData[index] = updatedCourse;
            }
          });
        } else {
          // If courseData is not provided, it's an add operation
          this.courseService.addCourse(result).subscribe(addedCourse => {
            // Push the newly added course to the submittedData array
            this.submittedData.push(addedCourse);
          });
        }
      }
    });
  }

  deleteCourse(courseId?: number): void {
    if (courseId !== undefined) {
     
      this.courseService.deleteCourse(courseId).subscribe(() => {
        
        this.submittedData = this.submittedData.filter(course => course.id !== courseId);
      }, error => {
        
        console.error('Error deleting course:', error);
      });
    } else {
      console.error('Error: Course ID is undefined.');
    }
  }
}