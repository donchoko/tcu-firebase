import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { DataService } from '../data.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-create-school',
  templateUrl: './create-school.component.html',
  styleUrls: ['./create-school.component.css']
})
export class CreateSchoolComponent implements OnInit {

  private _school;
  private _loggedUser;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router:Router, private afAuth: AngularFireAuth, private data:DataService, private db:AngularFireDatabase){
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser=>{
        if(!authUser){
          this.router.navigate(['']);
        }
        else{
          this._loggedUser = this.db.object('/users/'+authUser.uid);
        }
      });
    }

  createSchool(){
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this.db.list('/schools').push(this._school).then(()=>this.goSchools());
      }
    });
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  goSchools(){
    this.router.navigate(['/schools']);
  }

  ngOnInit() {
    this._school= {
      name:'',
      address:'',
      phone:''
    }
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
