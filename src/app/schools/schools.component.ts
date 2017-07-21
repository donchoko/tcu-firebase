import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit {

  constructor(private router:Router, private afAuth: AngularFireAuth, private db:AngularFireDatabase) { 
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit() {
  }

  goUsers(){
    this.router.navigate(['/users']);
  }

  goCreateSchool(){
    this.router.navigate(['/schools/create']);
  }

}
