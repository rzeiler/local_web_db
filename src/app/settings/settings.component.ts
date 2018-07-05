import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog,MAT_DIALOG_DATA } from '@angular/material';


/* DB */
import { AdService } from '../ad.service';


@Component({
  selector: 'import.component',
  templateUrl: 'import.component.html',
})
export class ImportComponent {

  title: string = "Daten überschreiben?";
  progressBarValue: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public db: AdService) { }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var self = this;
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    this.title = "Daten überschreiben.";

    myReader.onloadend = function(e) {
      var jsonObject: any = JSON.parse(myReader.result);
      var maxLength = jsonObject.length;
      var step = 100 / maxLength;
      let categoryIndex = 0;
      let cashIndex = 0;
      jsonObject.forEach(category => {
        self.progressBarValue += step;
        category.key = categoryIndex++;
        category.cash.forEach(cash => {
          cash.key = cashIndex++;
          cash.category = category.key;
        });
      });
      self.db.setData(jsonObject);
      self.progressBarValue = 100;
    }
    myReader.readAsText(file);
  }
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(public dialog: MatDialog, public router: Router) { }

  openDialog() {
    const dialogRef = this.dialog.open(ImportComponent, {
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/']);
      console.log(`Dialog result: ${result}`);
    });
  }

}
