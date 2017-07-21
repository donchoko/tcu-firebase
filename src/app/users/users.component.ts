import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  private users: FirebaseListObservable<any>;

  constructor(private router:Router, private afAuth: AngularFireAuth, private db:AngularFireDatabase) { 
    this.users= this.db.list('/users');
    console.log(this.users);
  }

  ngOnInit() {
  }

  goSchools(){
    this.router.navigate(['/schools']);
  }

  goCreateUser(){
    this.router.navigate(['/users/create']);
  }
}
