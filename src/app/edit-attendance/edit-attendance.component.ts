import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';

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
  private _loggedUser;
  private _errorMessage;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute, config: NgbDatepickerConfig) {
    this._date = Number.parseInt(this.route.snapshot.paramMap.get('date'));
    this._dateModel;
    this._new_students = [];
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this._loggedUser = this.db.object('/users/'+authUser.uid).subscribe((user)=>{
          this._loggedUser = user;
        });
        this.db.list('/attendances', {
          query: {
            orderByChild: 'date',
            equalTo: Number.parseInt(this.route.snapshot.paramMap.get('date'))
          }
        }).take(1).subscribe((attendances) => {
          if (attendances && attendances.length>0) {
            this._attendances = attendances;
            this.db.list('/students', {
              query: {
                orderByChild: 'section',
                equalTo: this.route.snapshot.paramMap.get('section')
              }
            }).take(1).subscribe((students) => {
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
          else{
            this._errorMessage = "No existe asistencias para este día";
          }
        });
      }
    });
  }

  createAttendance() {
    for (let a of this._attendances) {
      this.db.object('/attendances/' + a.$key).update(a);
      if(a.attended==false){
        this.db.object('/students/'+a.student+"/state").set('Ausente');
        this.db.object('/students/'+a.student+"/stateModified").set(this._date);
      }else if(a.attended==true){
        this.db.object('/students/'+a.student+"/state").set('Activo');
        this.db.object('/students/'+a.student+"/stateModified").set(this._date);
      }
    }

    if (this._new_students && this._new_students.length > 0) {
      for (let a of this._new_students) {
        a.date = this._date;
        this.db.list('/attendances').push(a);
        if(a.attended==false){
          this.db.object('/students/'+a.student+"/state").set('Ausente');
          this.db.object('/students/'+a.student+"/stateModified").set(this._date);
        }else if(a.attended==true){
          this.db.object('/students/'+a.student+"/state").set('Activo');
          this.db.object('/students/'+a.student+"/stateModified").set(this._date);
        }
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

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
  }

}
