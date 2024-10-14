import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://shareif-flix-0b8cde79839e.herokuapp.com'
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
  // Making the api call for the user registration endpoint

  /**
     * create new user
     * @param {Object} userDetails must include username, password and password. Optional: birthday
     * @returns 
     */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
       * login
       * @param {Object} userDetails must include username and password
       * @returns 
       */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails)
    return this.http.post(apiUrl + `/login?Username=${userDetails.Username}&Password=${userDetails.Password}`, userDetails).pipe(
      catchError(this.handleError)
    );
  }


  /**
     * get all movies
     * @returns if token is false, status 401 & text "unauthorized", else return array of movie object
     */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + '/movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  public getFavoriteMovies(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `/users/${Username}/movies/favorites`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
     * get movie by title
     * @param {string} title Movie's title
     * @returns if token is false, status 401 & text "unauthorized". if movie exists, status 200 & movie object. if movie doesn't exist, status 400 & text "No such movie"
     */
  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `/movies/${title}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * get genre by name
   * @param {string} genreName 
   * @returns 
   */
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `/movies/genre/${genreName}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
     * get user with username
     * @param {string} username
     * @returns if token is false, status 401 & text "unauthorized". if user exists, status 200 & user object. if user doesn't exist, status 400
     */
  public getUserByUsername(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `/users/${Username}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
      * get director with name
      * @param {string} directorName 
      * @returns if token is false, status 401 & text "unauthorized". if director exists, status 200 & director object. if director doesn't exist, status 400 & text "No such director"
      */
  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `/movies/directors/${directorName}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
     * change user's details
     * @param userDetails must include all the fields of user object
     * @returns if token is false, status 401 & text "unauthorized". if update user's details success, status 200 & user object.
     */

  public editUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + `/users/${userDetails.Username}`, userDetails,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer' + token,
        })
      }).pipe(
        map(this.extractResponseData), catchError(this.handleError)
      );
  }


  /**
     * add movie to user's favorite list
     * @param {string} Username 
     * @param {string} MovieID movie's id
     * @returns if token is false, status 401 & text "unauthorized". if add movie success, status 200 & user object. if movie doesn't exist, status 400 & text "No such movie"
     */
  public addFavoriteMovie(MovieID: string, Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + `/users/${Username}/movies/${MovieID}`, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
     * delete a movie from user's favorite list
    * @param {string} Username 
     * @param {string} MovieID movie's id
     * @returns if token is false, status 401 & text "unauthorized". if delete movie success, status 200 & user object.
     */
  public deleteFavoriteMovie(MovieID: string, Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `/users/${Username}/movies/${MovieID}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
       * delete user
       * @param userID 
       * @returns if token is false, status 401 & text "unauthorized". if delete user success, status 200 & text "${username} was deleted"
       */
  public deleteUser(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `/users/${Username}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }



  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
