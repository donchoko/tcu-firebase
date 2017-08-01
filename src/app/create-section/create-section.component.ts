import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.css']
})
export class CreateSectionComponent implements OnInit {

  private years:[number];
  private courses:[string];
  private schools;
  private _section;
  private _loggedUser;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this.afAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this._loggedUser = this.db.object('/users/'+authUser.uid).subscribe((user)=>{
          this._loggedUser = user;
        });
        this._section= {
          course:'',
          section:'',
          school:'',
          year:''
        };
        this.schools = this.db.list('/schools');

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
          'Undécimo'
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

  createSection(){
    this.afAuth.authState.subscribe(authUser => {
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

}
