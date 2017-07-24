import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private _attendances;
  private _annotations;
  private _student;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        
        this.db.object('/students/'+this.route.snapshot.paramMap.get('student'))
        .subscribe((student)=> {
          this._student= student,
          ()=>{
            this._attendances = this.db.list('/attendances', {
                query: {
                  orderByChild:'student',
                  equalTo: this._student.$key
                }
            });

            this._annotations = this.db.list('/annotations', {
                query: {
                  orderByChild:'student',
                  equalTo: this._student.$key
                }
            });
          }
        });
        
      }
    });
  }

  goStudents() {
    this.router.navigate(['/students/'+this._student.school+'/'+this._student.section]);
  }

  ngOnInit() {
  }

}