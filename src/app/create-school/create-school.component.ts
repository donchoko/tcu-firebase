import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { DataService } from '../data.service';

@Component({
  selector: 'app-create-school',
  templateUrl: './create-school.component.html',
  styleUrls: ['./create-school.component.css']
})
export class CreateSchoolComponent implements OnInit {

  private _school;

  constructor(private router:Router, private afAuth: AngularFireAuth, private data:DataService, private db:AngularFireDatabase){
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
    });
  }

  createUser(){
    if(!this.data.currentUser){
      this.router.navigate(['']);
    }
    else if (this.data.currentUser) {
      this.data.currentUser.subscribe(user => {
        if (!user) {
          this.router.navigate(['']);
        }
      });
    }
    else{
      this.db.object('/schools').set(this._school);
    }
  }

  ngOnInit() {
    this._school= {
      name:'',
      address:'',
      phone:''
    }
  }

}
