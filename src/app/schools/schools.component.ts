import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { DataService } from '../data.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit {

  private _schools:FirebaseListObservable<any>;

  constructor(private router:Router, private afAuth: AngularFireAuth, private db:AngularFireDatabase, data:DataService) { 
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this._schools = this.db.list('/schools');
      }
    });
  }



  ngOnInit() {
  }

  goClassrooms(uid:string){
    this.router.navigate(['/sections',uid]);
  }

  goCreateSchool(){
    this.router.navigate(['/schools/create']);
  }

  goEditSchool(){
    console.log("AGREGAR LOGICA PARA IR A EDITAR");
  }

  goUsers(){
    this.router.navigate(['/users']);
  }

}
