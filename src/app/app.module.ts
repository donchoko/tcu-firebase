import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from "@angular/router";
import { SchoolsComponent } from './schools/schools.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DataService } from './data.service';
import { CreateSchoolComponent } from './create-school/create-school.component';
import { CoreModule } from './core/core.module';
import { UsersComponent } from './users/users.component';

const appRoutes: Routes= [
  { path:'', component:LoginComponent},
  { path:'users', component:UsersComponent},
  { path:'schools', component:SchoolsComponent},
  { path:'schools/create', component:CreateSchoolComponent},
  { path:'users/create', component:CreateUserComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SchoolsComponent,
    CreateUserComponent,
    CreateSchoolComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CoreModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
