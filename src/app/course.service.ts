import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { CourseDialogData } from './course-dialog/course-dialog.component';



@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // getCoursesByUserId(userId: number): Observable<CourseDialogData[]> {
  //   return this.http.get<CourseDialogData[]>(`${this.apiUrl}/courses?userId=${userId}`);
  // }

  getAllCourses(): Observable<CourseDialogData[]> {
    return this.http.get<CourseDialogData[]>(`${this.apiUrl}/courses`);
  }

  addCourse(course: CourseDialogData): Observable<CourseDialogData> {
    return this.http.post<CourseDialogData>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(course: CourseDialogData): Observable<CourseDialogData> {
    return this.http.put<CourseDialogData>(`${this.apiUrl}/courses/${course.id}`, course);
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`);
  }

  
}
