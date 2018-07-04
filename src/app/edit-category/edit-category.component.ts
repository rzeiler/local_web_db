import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdService } from '../ad.service';

import { Validators, FormGroup, FormBuilder } from '@angular/forms';
/* material */
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'delete.component',
  templateUrl: 'delete.component.html',
})
export class DeleteComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent {

  isFormReady: boolean = false;
  itemHasKey: boolean = false;
  ad: any;
  adForm: FormGroup;

  constructor(
    private adService: AdService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
    // this.buildForm();
    // uaService.authUser().subscribe((user: AuthInfo) => {
    //   if (user.uid != null) {
    //     this.ai = user;
    //     route.params.subscribe(params => {
    //       if (params.id !== undefined) {
    //         this.itemHasKey = true;
    //         this.ad = this.adService.editAd(params.id, user.uid);
    //         this.ad.valueChanges().subscribe(ad => {
    //           this.adForm.patchValue(ad);
    //           this.adForm.controls['_date'].setValue(new Date(ad.createdate));
    //         });
    //       } else {
    //         this.itemHasKey = false;
    //         this.adForm.controls['_date'].setValue(new Date());
    //       }
    //     });
    //   }
    // });
  }

  ngOnInit() {

  }

  deleteConfirm() {
    // const dialogRef = this.dialog.open(DeleteComponent, {
    //   width: '80%',
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //
    //   if (result) {
    //     const data = this.adForm.value
    //     this.adService.updateAd(this.ad, { isdeleted: true }).then(x => {
    //
    //       this.router.navigate(['/']);
    //
    //       this.snackBar.open("Daten gelöscht!", null, {
    //         duration: 2000,
    //       });
    //     });
    //   }
    // });
  }

  saveAdChanges() {
    // if (this.adForm.status != 'VALID') {
    //   console.log('form is not valid, cannot save to database')
    //   return
    // }
    // const data = this.adForm.value
    // if (this.itemHasKey) {
    //   this.adService.updateAd(this.ad, { title: data.title, rating: data.rating, createdate: Date.parse(data._date) }).then(x => {
    //     this.snackBar.open("Daten gespeichert.", null, {
    //       duration: 2000,
    //     });
    //   });
    // } else {
    //   this.adService.createAd(this.ai.uid, { title: data.title, rating: data.rating, createdate: Date.parse(data._date), isdeleted: false }).then(x => {
    //     this.snackBar.open("Daten gespeichert.", null, {
    //       duration: 2000,
    //     });
    //   });
    // }

  }

  private buildForm() {
    // this.adForm = this.fb.group({
    //   title: ['', Validators.required],
    //   rating: null,
    //   createdate: { value: 0, disabled: true },
    //   key: null,
    //   _date: { value: 0, disabled: false, readonly: true }
    // });
    // this.isFormReady = true;

  }

}
