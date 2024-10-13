import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
/**
 * Represents a dialog component displaying movie synopsis.
 */
@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss'],
})
export class GenreInfoComponent {
  movie: any;
  genre: any;

  /**
   * Initializes the SynopsisComponent.
   * @param {MatDialogRef<GenreInfoComponent>} dialogRef - Reference to the dialog.
   * @param {any} data - Data injected into the dialog.
   */
  constructor(
    public dialogRef: MatDialogRef<GenreInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.genre = data;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
