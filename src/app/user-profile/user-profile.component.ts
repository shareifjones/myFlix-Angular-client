import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];

  constructor(

    public fetchApiData: FetchApiDataService,
    public router: Router

  ) { }

  ngOnInit(): void {
    this.getfavoriteMovies
    this.getUser
  }
  getUser(): void {
    this.fetchApiData.getUserByUsername(this.userData.Username).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.Password,
        token: this.userData.Token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
    })
  }
  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }

  getfavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.favoriteMovies = res.filter((movie: any) => {
        return this.userData.favoriteMovies.includes(movie._id)
      })
    }, (err: any) => {
      console.error(err);
    });
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userData.id, movie.Title).subscribe((res: any) => {
      this.userData.favoriteMovies = res.favoriteMovies;
      this.getfavoriteMovies();
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




