import { Component, OnInit, Inject } from '@angular/core';
import { AuthInfo } from "../auth-info";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

/* DB */
import { AdService } from '../ad.service';

@Component({
  selector: 'import.component',
  templateUrl: 'import.component.html',
})
export class ImportComponent {

  title: string = "Daten überschreiben?";
  Info: string = "...";
  progressBarValue: number = 0;
  //public auth: AuthInfo;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public db: AdService) {

    // userAuthService.authUser().subscribe((user: AuthInfo) => {
    //   if (user.uid != null) {
    //     this.auth = user;
    //     //this.itemsRef = db.list('/' + user.uid + '/category/')
    //   }
    // });
  }

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
        });
      });
      self.db.updateAd(JSON.stringify(jsonObject))
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
export class SettingsComponent implements OnInit {

  constructor(public dialog: MatDialog) {
    // userAuthService.authUser().subscribe((user: AuthInfo) => {
    //   if (user.uid != null) {
    //     this.auth = user;
    //   }
    // });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ImportComponent, {
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  login() {
    //this.userAuthService.login();
  }

  logout() {
    // this.userAuthService.logout();
    // this.auth = null;
  }

  ngOnInit() {
  }



}
