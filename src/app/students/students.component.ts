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
  private _loggedUser;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this._loggedUser = this.db.object('/users/'+authUser.uid).subscribe((user)=>{
          this._loggedUser = user;
        });
        this.route.paramMap.map((params: ParamMap) =>
          this.db.list('/students', {
            query: {
              orderByChild:'section',
              equalTo: params.get('section')
            }
          })
        ).subscribe((students: FirebaseListObservable<any>) => this._students = students);
      }
    });
  }

  ngOnInit() {
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
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

  goReport(){
    this.router.navigate(['students/'+this.route.snapshot.paramMap.get('school')+'/'+this.route.snapshot.paramMap.get('section')+'/report'])
  }

  goChooseDate(){
    this.router.navigate(['/attendance/'+this.route.snapshot.paramMap.get('section')+'/date']);
  }

  goEditStudent(student:string){
    this.router.navigate(['students/'+this.route.snapshot.paramMap.get('school')+'/'+this.route.snapshot.paramMap.get('section')+'/'+student+'/edit'])
  }
}
