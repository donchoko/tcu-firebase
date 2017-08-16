import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Rx';
import { User } from 'firebase/app';
import { Router } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent implements OnInit {

  private user: Observable<User>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router:Router, public afAuth: AngularFireAuth) {
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser=>{
      if(authUser){
        this.router.navigate(['schools']);
      }
    });
  }

  ngOnInit() {
  }

  //Este metodo se encarga de autenticarse con Firebase
  login(email:string, pass:string){
    this.afAuth.auth.signInWithEmailAndPassword(email,pass);
    this.user.subscribe(authUser=>{
      if(authUser){
        console.log(this.user);
        this.goSchools();
      }
    });
    
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goSchools(){
    this.router.navigate(['/schools']);
  }

}
