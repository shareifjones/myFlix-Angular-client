import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  FavoriteMovies: any[] = [];


  constructor(

    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    // this.getFavoriteMovies()
    this.getUser()
  }
  getUser(): void {
    let user = JSON.parse(localStorage.getItem("user") || "");
    // console.log("user", user)
    this.fetchApiData.getUserByUsername(user.Username).subscribe((res: any) => {
      // console.log("response", res)
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.Password,
        token: this.userData.Token
      };

      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getFavoriteMovies();
    })
  }


  updateUser(): void {
    let user = JSON.parse(localStorage.getItem("user") || "");
    this.fetchApiData.editUser(user.Username, this.userData).subscribe((res: any) => {
      const passwordText = this.userData.Password
      res.Password = passwordText
      this.userData = {
        ...res,
        id: res._id,
        password: passwordText,
        token: this.userData.Token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getFavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.FavoriteMovies = res.filter((movie: any) => {
        return this.userData.FavoriteMovies.includes(movie._id)
      })

      // console.log("favorite movie", this.FavoriteMovies)
    }, (err: any) => {
      console.error(err);
    });
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(movie._id, this.userData.Username).subscribe((res: any) => {
      this.userData.FavoriteMovies = res.FavoriteMovies;
      this.getFavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  backToMovie(): void {
    this.router.navigate(["movies"]);
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
}




