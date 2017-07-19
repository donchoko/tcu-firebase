import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Rx';
import { User } from 'firebase/app';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent implements OnInit {

  user: Observable<User>;

  constructor(private router:Router, public afAuth: AngularFireAuth, private data:DataService) {
    this.user = afAuth.authState;
  }

  ngOnInit() {
  }

  //Este metodo se encarga de autenticarse con Firebase
  login(email:string, pass:string){
    this.afAuth.auth.signInWithEmailAndPassword(email,pass);
    this.user.subscribe(authUser=>{
      if(authUser){
        console.log(this.user);
        this.data.currentUser = this.user;
        this.router.navigate(['/schools/create']);
      }
    });
    
  }

}
