import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  private _sections: any;
  private _loggedUser;
  private _school;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) {
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this._loggedUser = this.db.object('/users/'+authUser.uid);
        this._sections = this.db.list('/sections', {
            query: {
              orderByChild:'school',
              equalTo: this.route.snapshot.paramMap.get('school')
            }
        });

        this._school= this.db.object('/schools/'+this.route.snapshot.paramMap.get('school'));
      }
    });
  }

  ngOnInit() {
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  goSchools() {
    this.router.navigate(['/schools']);
  }

  goCreateSection() {
    this.router.navigate(['/sections/'+this.route.snapshot.paramMap.get('school')+'/create']); 
  }

  goStudents(section:string) {
    this.router.navigate(['/students/'+this.route.snapshot.paramMap.get('school')+'/'+section]);
  }

  goEditSection(section:string) {
    this.router.navigate(['/sections/'+this.route.snapshot.paramMap.get('school')+'/'+section+'/edit']);
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
