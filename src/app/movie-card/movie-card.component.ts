import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


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
    public dialog: MatDialog

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

  showDirector(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe((resp: any) => {
      this.director = resp;
      console.log('Director Details:', this.director);
      return this.director;
    });
  }



  redirectProfile(): void {
    this.router.navigate(["profile"]);
  }

  logout(): void {
    this.router.navigate(["welcome"]);
  }

}