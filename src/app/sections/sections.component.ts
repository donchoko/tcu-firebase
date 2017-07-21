import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  private _sections: any;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) {
    this.afAuth.authState.subscribe(authUser => {
      if (!authUser) {
        this.router.navigate(['']);
      }
      else {
        this.route.paramMap.map((params: ParamMap) =>
          this.db.list('/sections', {
            query: {
              equalTo: params.get('id')
            }
          })
        ).subscribe((sections: FirebaseListObservable<any>) => this._sections = sections);

      }
    });
  }

  ngOnInit() {
  }

  goSchools() {
    this.router.navigate(['/schools']);
  }

  goCreateSection() {
    this.route.paramMap.map((params: ParamMap) =>
      params.get('id')
    ).subscribe((param)=> this.router.navigate(['/sections/'+param+'/create']))
    
  }
}
