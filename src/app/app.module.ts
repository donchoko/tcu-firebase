import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from "@angular/router";
import { SchoolsComponent } from './schools/schools.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DataService } from './data.service';
import { CreateSchoolComponent } from './create-school/create-school.component';
import { CoreModule } from './core/core.module';
import { UsersComponent } from './users/users.component';
import { SectionsComponent } from './sections/sections.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateSectionComponent } from './create-section/create-section.component';
import { StudentsComponent } from './students/students.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateAnnotationComponent } from './create-annotation/create-annotation.component';
import { ChooseDateComponent } from './choose-date/choose-date.component';
import { CreateAttendanceComponent } from './create-attendance/create-attendance.component';
import { EditAttendanceComponent } from './edit-attendance/edit-attendance.component';
import { SectionReportComponent } from './section-report/section-report.component';
import { EditSchoolComponent } from './edit-school/edit-school.component';
import { EditSectionComponent } from './edit-section/edit-section.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { SectionPipe } from './section-pipe.pipe';
import { UserPipe } from './user-pipe.pipe';

const appRoutes: Routes= [
  { path:'', component:LoginComponent},
  { path:'users', component:UsersComponent},
  { path:'schools', component:SchoolsComponent},
  { path:'sections/:school', component:SectionsComponent},
  { path:'students/:school/:section', component:StudentsComponent},
  { path:'students/:school/:section/report', component:SectionReportComponent},
  { path:'profile/:student', component:ProfileComponent},
  { path:'schools/create', component:CreateSchoolComponent},
  { path:'users/create', component:CreateUserComponent},
  { path:'attendance/:section/date', component:ChooseDateComponent},
  { path:'attendance/:section/:date/edit', component:EditAttendanceComponent},
  { path:'students/:school/:section/create', component:CreateStudentComponent},
  { path:'sections/:school/create', component:CreateSectionComponent},
  { path:'annotation/create/:student', component:CreateAnnotationComponent},
  { path:'attendance/:section/create', component:CreateAttendanceComponent},
  { path:'schools/:school/edit', component:EditSchoolComponent},
  { path:'sections/:school/:section/edit', component:EditSectionComponent},
  { path:'students/:school/:section/:student/edit', component:EditStudentComponent},
  { path:'**', component:PageNotFoundComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SchoolsComponent,
    CreateUserComponent,
    CreateSchoolComponent,
    UsersComponent,
    SectionsComponent,
    PageNotFoundComponent,
    CreateSectionComponent,
    StudentsComponent,
    CreateStudentComponent,
    ProfileComponent,
    CreateAnnotationComponent,
    ChooseDateComponent,
    CreateAttendanceComponent,
    EditAttendanceComponent,
    SectionReportComponent,
    EditSchoolComponent,
    EditSectionComponent,
    EditStudentComponent,
    SectionPipe,
    UserPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    ),
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CoreModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
