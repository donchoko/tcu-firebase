import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Rx';
import { User } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AdmindbService } from '../admindb.service';
import { environment } from 'environments/environment';
import * as firebase from 'firebase';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  providers: []
})
export class CreateUserComponent implements OnInit {

  private _user;
  private roles;

  constructor(private db: AngularFireDatabase, private router: Router, private data: DataService, public afAuth:AngularFireAuth){
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
    });
  }

  findApp (app){
   return  app.name == "Temporary";
  }

  createUser() {
    let tApp;

    if(!firebase.apps.find(this.findApp)){
      tApp = firebase.initializeApp(environment.firebase, "Temporary");
      console.log("Ya logueado");
    }
    else{
      tApp = firebase.apps.find(this.findApp);
      console.log("No logueado");
    }

    var users = this.db.object('/users');

    tApp.auth().createUserWithEmailAndPassword(this._user.email, this._user.pass)
    .then((newUser) => {
      if(newUser) return newUser
    })
    .then((newUser)=>{
        users.set({
          userUid: newUser.uid,
          role: this._user.type
        })
      }
    );
    
    tApp.auth().signOut();
   
  }


  ngOnInit() {
    this._user = {
      email: '',
      pass: '',
      type: ''
    }

    this.roles = [
      {name:'Administrador', value:'ADMIN'},
      {name:'Colaborador', value:'COLAB'}
    ]
  }

}
