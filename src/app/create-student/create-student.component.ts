import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent implements OnInit {

  private _student;
  private states:[string];
  private _school;
  private _section;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this._student={
      firstName:'',
      secondName:'',
      firstLastName:'',
      secondLastName:'',
      section:'',
      state:''
    };

    this.afAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
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
        ];

      }
    });
  }

  goStudents() {
    this.router.navigate(['/students/'+this.route.snapshot.paramMap.get('school')+'/'+this.route.snapshot.paramMap.get('section')]);
  }

  createStudent(){
    this.afAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this.db.list('/students').push(this._student).then(()=>this.goStudents());
      }
    });
  }

  ngOnInit() {
    
  }

}
