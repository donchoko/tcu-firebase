import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  private _students:FirebaseListObservable<any>;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this.route.paramMap.map((params: ParamMap) =>
          this.db.list('/students', {
            query: {
              orderByChild:'section',
              equalTo: params.get('section')
            }
          })
        ).subscribe((sections: FirebaseListObservable<any>) => this._students = sections);
      }
    });
  }

  ngOnInit() {
  }

  goCreateAttendance(){
    this.router.navigate(['/attendance/'+this.route.snapshot.paramMap.get('section')+'/create']);
  }


  goCreateStudent() {
   this.router.navigate(['/students/'+ this.route.snapshot.paramMap.get('school')+'/'+ this.route.snapshot.paramMap.get('section')+'/create']);
  }

  goSections(){
    this.route.paramMap.map((params: ParamMap) =>
      params.get('school')
    ).subscribe((param)=> this.router.navigate(['/sections/'+param]))
  }

  goProfile(studentId:string){
    this.router.navigate(['profile/'+studentId]);
  }
}
