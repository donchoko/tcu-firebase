import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.css']
})
export class CreateSectionComponent implements OnInit {

  private years:[number];
  private courses:[string];
  private _school;
  private _section;
  private _loggedUser;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this.courses=[
      'Primero',
      'Segundo',
      'Tercero',
      'Cuarto',
      'Quinto',
      'Sexto',
      'Séptimo',
      'Octavo',
      'Noveno',
      'Décimo',
      'Undécimo',
      'Duodécimo',
      'PN-1',
      'PN-2',
      'PN-3',
      'PN-4',
      'PN-5',
      'PN-6',
      'PN-7',
      'PN-8',
      'PN-9',
      'PN-10',
      'PN-11',
      'PN-12',
    ];

    this.years = [
      2017,
      2018,
      2019,
      2020,
      2021,
      2022,
      2023,
      2024,
      2025,
      2026,
      2027,
    ];

    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this._loggedUser = this.db.object('/users/'+authUser.uid);
        this._section= {
          course:'',
          section:'',
          school:'',
          year:''
        };
        this.db.object('/schools/'+this.route.snapshot.paramMap.get('school')).takeUntil(this.ngUnsubscribe).subscribe((school)=>{
          this._school = school;
          this._section.school = school.$key;
        });
      }
    });
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  goSections(){
    this.router.navigate(['/sections/'+this.route.snapshot.paramMap.get('school')])
  }

  createSection(){
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this.db.list('/sections').push(this._section).then(()=>this.goSections());
      }
    });
  }


  ngOnInit() {
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
