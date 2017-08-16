import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.css']
})
export class EditSectionComponent implements OnInit {

  private years:[number];
  private courses:[string];
  private _school;
  private _section;
  private _loggedUser;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  
  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this._loggedUser = this.db.object('/users/'+authUser.uid);

        this.db.object('/sections/'+this.route.snapshot.paramMap.get('section')).takeUntil(this.ngUnsubscribe).subscribe((section)=>{
          this._section = section;
        });
        
        console.log(this.route.snapshot.paramMap.get('school'));
        this.db.object('/schools/'+this.route.snapshot.paramMap.get('school')).takeUntil(this.ngUnsubscribe).subscribe((school)=>{
          this._school = school;
        });

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
        ]
      }
    });
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  goSections(){
    this.route.paramMap.map((params: ParamMap) =>
      params.get('school')
    ).subscribe((param)=> this.router.navigate(['/sections/'+param]))
  }

  editSection(){
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this.db.object('/sections/'+this.route.snapshot.paramMap.get('section')).update(this._section).then(()=>this.goSections());
      }
    });
  }

  compareValue(val1, val2){
    return val1 === val2;
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
