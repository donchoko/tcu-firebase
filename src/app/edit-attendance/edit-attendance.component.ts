import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-attendance',
  templateUrl: './edit-attendance.component.html',
  styleUrls: ['./edit-attendance.component.css'],
  providers: [NgbDatepickerConfig]
})
export class EditAttendanceComponent implements OnInit {

  private _attendances;
  private _students;
  private _date;
  private _dateModel
  private _new_students;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute, config: NgbDatepickerConfig) {
    this._date = Number.parseInt(this.route.snapshot.paramMap.get('date'));
    this._dateModel;
    this._new_students = [];
    this.afAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this.db.list('/attendances', {
          query: {
            orderByChild: 'date',
            equalTo: Number.parseInt(this.route.snapshot.paramMap.get('date'))
          }
        }).subscribe((attendances) => {
          if (attendances) {
            this._attendances = attendances;
            console.log(this._attendances);
            this.db.list('/students', {
              query: {
                orderByChild: 'section',
                equalTo: this.route.snapshot.paramMap.get('section')
              }
            }).subscribe((students) => {
              students.forEach(student => {
                if (attendances.some(attendance => student.$key == attendance.student) == false) {
                  this._new_students.push({
                    name: student.firstName + ' ' + student.secondName + ' ' + student.firstLastName + ' ' + student.secondLastName,
                    student: student.$key,
                    date: this._date,
                    attended: false
                  })
                }
              });
            })
          }
        });
      }
    });
  }

  createAttendance() {
    for (let a of this._attendances) {
      console.log(a.$key);
      this.db.object('/attendances/' + a.$key).update(a);
    }

    if (this._new_students && this._new_students.length > 0) {
      for (let a of this._new_students) {
        a.date = this._date;
        this.db.list('/attendances').push(a);
      }
    }
    this.goStudents();
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['']));
  }

  selectAll() {
    if (this._attendances.length > 0) {
      for (let a of this._attendances) {
        a.attended = true;
      }
      for (let a of this._new_students) {
        a.attended = true;
      }
    }
  }

  selectNone() {
    if (this._attendances.length > 0) {
      for (let a of this._attendances) {
        a.attended = false;
      }
      for (let a of this._new_students) {
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

}
