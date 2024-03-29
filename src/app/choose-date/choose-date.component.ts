import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-choose-date',
  templateUrl: './choose-date.component.html',
  styleUrls: ['./choose-date.component.css']
})
export class ChooseDateComponent implements OnInit {
  
  private _date;
  private _dateModel:NgbDateStruct;
  private _loggedUser;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute, config: NgbDatepickerConfig) {
    //this._date = new Date();
    //config.minDate={year: this._date.getFullYear(), month: this._date.getMonth()+1, day: this._date.getDate()}

    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this._loggedUser = this.db.object('/users/'+authUser.uid).subscribe((user)=>{
          this._loggedUser = user;
        });
      }
    });
  }

  goEditDate(){
    //attendance/:section/:date/edit
    if(this._dateModel){
      let d = new Date(this._dateModel.year, this._dateModel.month-1,this._dateModel.day);
      this.router.navigate(['/attendance/'+this.route.snapshot.paramMap.get('section')+'/'+d.getTime()+'/edit']);
    }
  }

  goStudents() {
    let school = this.db.object('/sections/'+this.route.snapshot.paramMap.get('section')).subscribe((section)=>{
      this.router.navigate(['/students/'+section.school+'/'+this.route.snapshot.paramMap.get('section')]);
    }); 
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
