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

  createSchool(){
    this.afAuth.authState.subscribe(authUser=>{
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

}
