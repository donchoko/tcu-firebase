import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-create-attendance',
  templateUrl: './create-attendance.component.html',
  styleUrls: ['./create-attendance.component.css'],
  providers: [NgbDatepickerConfig]
})
export class CreateAttendanceComponent implements OnInit {

  private _attendances: any[];
  private _students;
  private _excluded_students
  private _date;
  private _dateModel;
  private _loggedUser;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute, config: NgbDatepickerConfig) {
    this._date = new Date();
    this._dateModel;
    this._attendances = [];
    this._excluded_students = [];
    config.minDate = { year: this._date.getFullYear(), month: this._date.getMonth() + 1, day: this._date.getDate() }

    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this._loggedUser = this.db.object('/users/' + authUser.uid).subscribe((user) => {
          this._loggedUser = user;
        });
        this.db.list('/students', {
          query: {
            orderByChild: 'section',
            equalTo: this.route.snapshot.paramMap.get('section')
          }
        }).subscribe((items) => {
          if (items) {
            items.map((student) => {
              if (student.state != "Traslado" && student.state != "Exclusión") {
                this._attendances.push({
                  name: student.firstName + ' ' + student.secondName + ' ' + student.firstLastName + ' ' + student.secondLastName,
                  student: student.$key,
                  date: this._date,
                  attended: true,
                  section: this.route.snapshot.paramMap.get('section')
                })
              }
              else if (student.state == "Exclusión") {
                this._excluded_students.push({
                  name: student.firstName + ' ' + student.secondName + ' ' + student.firstLastName + ' ' + student.secondLastName
                })
              }
            })
          }
        });
      }
    });
  }

  createAttendance() {
    if (this._dateModel) {

      this._date = new Date(this._dateModel.year, this._dateModel.month - 1, this._dateModel.day).getTime();

      if (this._attendances.length > 0) {
        this.db.list('/attendances', {
          query: {
            orderByChild: 'section',
            equalTo: this.route.snapshot.paramMap.get('section')
          }
        }).take(1).subscribe((list) => {
          if (list.some(element => element.date == this._date)) {
            window.alert("Ya existe asistencia en esa fecha");
          }
          else {
            for (let a of this._attendances) {
              a.date = this._date;
              this.db.list('/attendances').push(a).then(() => {
                if (a.attended == false) {
                  this.db.object('/students/' + a.student + "/state").set('Ausente');
                  this.db.object('/students/' + a.student + "/stateModified").set(this._date);
                } else if (a.attended == true) {
                  this.db.object('/students/' + a.student + "/state").set('Activo');
                  this.db.object('/students/' + a.student + "/stateModified").set(this._date);
                }
              })
            }
            this.goStudents();
          }
        });
      }
    }
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['']));
  }

  selectAll() {
    if (this._attendances.length > 0) {
      for (let a of this._attendances) {
        a.attended = true;
      }
    }
  }

  selectNone() {
    if (this._attendances.length > 0) {
      for (let a of this._attendances) {
        a.attended = false;
      }
    }
  }

  goStudents() {
    let school = this.db.object('/sections/' + this.route.snapshot.paramMap.get('section')).subscribe((section) => {
      this.router.navigate(['/students/' + section.school + '/' + this.route.snapshot.paramMap.get('section')]);
    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
