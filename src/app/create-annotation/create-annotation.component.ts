import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

@Component({
  selector: 'app-create-annotation',
  templateUrl: './create-annotation.component.html',
  styleUrls: ['./create-annotation.component.css']
})
export class CreateAnnotationComponent implements OnInit {

  private _student;
  private _annotation;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this._annotation= {
      date:'',
      text:'',
      student:'',
      createdBy:''
    }

    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this.db.object('/students/'+this.route.snapshot.paramMap.get('student'))
          .subscribe((student)=> {this._student= student, this._annotation.student= student.$key});
        this._annotation.date= firebase.database.ServerValue.TIMESTAMP;
        this._annotation.createdBy= authUser.uid;
      }
    });
  }

  goProfile(){
    this.router.navigate(['profile/'+this._student.$key]);
  }

  createAnnotation(){
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this.db.list('/annotations').push(this._annotation).then(()=>this.goProfile())
      }
    });
  }

  ngOnInit() {
  }

}
