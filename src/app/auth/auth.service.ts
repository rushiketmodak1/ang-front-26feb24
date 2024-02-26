import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

// export interface AuthResponseData {
//   kind: string;
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
// }
export interface AuthResponseData {
  token: string;
  user: {
    email: string;
    id: number;
    username: string;
  };
  expiresIn:string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  
  signup(username:string,email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        // 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAqLuLHajTUHf_Eue7DQJXDnESLy0BLgzg',
        `http://localhost:5000/api/v1/register`,
        {
          username:username,
          email: email,
          password: password,
          // returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.user.email,
            resData.user.id.toString(),
            resData.token,
            // Adjust expiresIn as needed for your use case
          10000 // Assuming expiresIn is still available
          );
          // this.handleAuthentication(
          //   resData.email,
          //   resData.localId,
          //   resData.idToken,
          //   +resData.expiresIn
          // );
        })
      );
  }

  // login(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>(
  //       // 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAqLuLHajTUHf_Eue7DQJXDnESLy0BLgzg',
  //      `http://localhost:5000/api/v1/login`,
  //       {
  //         email: email,
  //         password: password,
  //         // returnSecureToken: true
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap(resData => {

  //         console.log(resData)
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       })
  //     );
  // }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'http://localhost:5000/api/v1/login',
        {
          email: email,
          password: password,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.user.email,
            resData.user.id.toString(),
            resData.token,
            // Adjust expiresIn as needed for your use case
            10000 // Assuming expiresIn is still available
          );
        })
      );
  }
  
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null); // Clear the user subject
    this.router.navigate(['/']); // Navigate to the authentication page
    localStorage.removeItem('userData'); // Remove user data from local storage

    // Clear the token expiration timer if it exists
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null; // Reset the timer variable
    }
}

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
    // }, 2000);
  }

  // private handleAuthentication(
    
  //   email: string,
  //   userId: string,
  //   token: string,
  //   expiresIn: number
  // ) {
  //   const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  //   const user = new User(email, userId, token, expirationDate);
  //   this.user.next(user);
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem('userData', JSON.stringify(user));
  // }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
