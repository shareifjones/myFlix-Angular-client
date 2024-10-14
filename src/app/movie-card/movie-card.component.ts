import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})


export class MovieCardComponent {
  movies: any[] = [];
  genre: any;
  director: any;

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: movie.Director,
      width: '600px',
    });
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie }, // Pass the movie object to the dialog
      width: '600px',
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: genre, // Pass the movie object to the dialog
      width: '600px',
    });
  }

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem("user") || "");
    let icon = document.getElementById(`${movie._id}-favorite-icon`);


    if (user.FavoriteMovies.includes(movie._id)) {
      this.fetchApiData.deleteFavoriteMovie(user.id, movie.title).subscribe(res => {
        icon?.setAttribute("fontIcon", "favorite_border")
        console.log("deleted", res);
        user.FavoriteMovies = res.FavoriteMovies;
        localStorage.setItem("user", JSON.stringify(user));
      }, err => {
        console.error(err)
      })
    } else {
      // icon?.setAttribute("fontIcon", "favorite");
      // user.favoriteMovies.push(movie._id);
      // addFavoriteMovie return unauth, debugging
      this.fetchApiData.addFavoriteMovie(movie._id, user.Username).subscribe(res => {
        icon?.setAttribute("fontIcon", "favorite");
        console.log("added", res);
        user.FavoriteMovies = res.FavoriteMovies;
        localStorage.setItem("user", JSON.stringify(user));
      }, err => {
        console.error(err)
      })
    }
    localStorage.setItem("user", JSON.stringify(user));
  }

  redirectProfile(): void {
    this.router.navigate(["profile"]);
  }

  logout(): void {
    this.router.navigate(["welcome"]);
  }

}