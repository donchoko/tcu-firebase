import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  private _student;
  private states:[string];
  private _school;
  private _section;
  private _loggedUser;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this.afAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this.db.object('/users/'+authUser.uid).subscribe((user)=>{
          this._loggedUser = user;
        });

        this.db.object('/students/'+this.route.snapshot.paramMap.get('student')).subscribe((student)=>{
          this._student = student;
        });

        this.db.object('/schools/'+this.route.snapshot.paramMap.get('school')).subscribe((s)=>{
          this._school= s,
          this._student.school = s.$key;
        });
        this.db.object('/sections/'+this.route.snapshot.paramMap.get('section')).subscribe((s)=>{
          this._section= s,
          this._student.section = s.$key;
        });

        this.states=[
          'Activo',
          'Inactivo',
          'NSP',
          'Traslado',
          'Exclusión'
        ];

      }
    });
  }

  compareValue(val1, val2){
    return val1 === val2;
  }

  goStudents() {
    this.router.navigate(['/students/'+this.route.snapshot.paramMap.get('school')+'/'+this.route.snapshot.paramMap.get('section')]);
  }

  editStudent(){
    this.afAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this.db.object('/students/'+this.route.snapshot.paramMap.get('student')).update(this._student).then(()=>this.goStudents());
      }
    });
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  ngOnInit() {
  }

}
