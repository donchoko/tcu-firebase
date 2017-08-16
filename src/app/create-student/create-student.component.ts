import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';


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
  private _loggedUser;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this._student={
      firstName:'',
      secondName:'',
      firstLastName:'',
      secondLastName:'',
      section:'',
      state:'',
      identification:''
    };

    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this._loggedUser = this.db.object('/users/'+authUser.uid);
        
        this.db.object('/schools/'+this.route.snapshot.paramMap.get('school')).takeUntil(this.ngUnsubscribe).subscribe((s)=>{
          this._school= s,
          this._student.school = s.$key;
        });
        this.db.object('/sections/'+this.route.snapshot.paramMap.get('section')).takeUntil(this.ngUnsubscribe).subscribe((s)=>{
          this._section= s,
          this._student.section = s.$key;
        });

        this.states=[
          'Activo',
          'Riesgo',
          'NSP',
          'Traslado',
          'Exclusión',
          'Ausente'
        ];

      }
    });
  }

  goStudents() {
    this.router.navigate(['/students/'+this.route.snapshot.paramMap.get('school')+'/'+this.route.snapshot.paramMap.get('section')]);
  }

  createStudent(){
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        if(this._student.identification==''){
          this._student.identification = 'N/A';
        }

        this.db.list('/students').push(this._student).then(()=>this.goStudents());
      }
    });
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  ngOnInit() {
    
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
