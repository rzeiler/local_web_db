import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Globals } from './global';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/de';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'de');

/* material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
/* db */
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';

/* comp */
import { AppComponent } from './app.component';
import { UserAuthComponent } from './user-auth/user-auth.component';

/* serv */
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ToolbarComponent } from './toolbar/toolbar.component';


import { CategoryListComponent } from './category-list/category-list.component';

import { CashListComponent } from './cash-list/cash-list.component';
import { CashFormComponent } from './cash-form/cash-form.component';
import { SettingsComponent, ImportComponent } from './settings/settings.component';
import { EditCategoryComponent, DeleteComponent } from './edit-category/edit-category.component';
import { DesktopComponent } from './desktop/desktop.component';



const routes: Routes = [
  { path: '', component: CategoryListComponent },
  { path: 'category/:id/cash', component: CashListComponent },
  { path: 'category/:id', component: EditCategoryComponent },
  { path: 'category', component: EditCategoryComponent },
  { path: 'settings', component: SettingsComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    UserAuthComponent,
    ToolbarComponent,
    CategoryListComponent,
    CashListComponent,
    CashFormComponent,
    ImportComponent,
    SettingsComponent,
    EditCategoryComponent,
    DeleteComponent,
    DesktopComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    BrowserModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatGridListModule,
    MatTableModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [ImportComponent, DeleteComponent],
  providers: [Globals, MatNativeDateModule, { provide: LOCALE_ID, useValue: 'de' }, { provide: 'LOCALSTORAGE', useFactory: getLocalStorage }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getLocalStorage() {
  return (typeof window !== "undefined") ? window.localStorage : null;
}
