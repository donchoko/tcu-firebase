import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import {saveAs} from 'file-saver';
import * as XLSX from 'xlsx'; 
 
@Component({
  selector: 'app-section-report',
  templateUrl: './section-report.component.html',
  styleUrls: ['./section-report.component.css']
})
export class SectionReportComponent implements OnInit {

  private _students;
  private _section;
  private _school;
  private _states;
  private _date:Date;
  private wopt:XLSX.WritingOptions = {
    bookType:'xlsx',
    type:'binary',
  }
  private _filename;

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this._states = [
      {
        name:'Activo',
        amount: 0
      },
      {
        name:'Inactivo',
        amount: 0
      },
      {
        name:'NSP',
        amount: 0
      },
      {
        name:'Cambio de colegio',
        amount: 0
      },
      {
        name:'Riesgo',
        amount: 0
      },
      {
        name:'Total',
        amount: 0
      }
    ];
    
    this.afAuth.authState.subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this.db.object('/schools/'+this.route.snapshot.paramMap.get('school'))
          .subscribe((school)=> this._school = school);
        
        this.db.object('/sections/'+this.route.snapshot.paramMap.get('section'))
          .subscribe((section)=>{
            this._section = section
            this._date = new Date();
            this._filename = section.course+"-"+section.section+"-"+this._date.getDate()+'/'+this._date.getMonth()+'/'+this._date.getFullYear();
        });

        this.db.list('/students', {
            query: {
              orderByChild:'section',
              equalTo: this.route.snapshot.paramMap.get('section')
            }
        }).subscribe((students) =>{
          this._students = students;
          
          students.forEach(element => {
            if(element.state == "Activo"){
              this._states[0].amount++;
            }

            else if(element.state == "Inactivo"){
              this._states[1].amount++;
            }
            
            else if(element.state == "Cambio de colegio"){
              this._states[2].amount++;
            }
            
            else if(element.state == "NSP"){
              this._states[3].amount++;
            }

            else if(element.state == "Riesgo"){
              this._states[4].amount++;
            }
          });
          for(let i=0; i<this._states.length-1; i++){
            console.log(this._states[5].amount +" - "+ this._states[i].amount);
            this._states[5].amount += this._states[i].amount;
          }
        });
      }     
    });
  }

  ngOnInit() {
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  goStudents() {
    this.router.navigate(['/students/'+this.route.snapshot.paramMap.get('school')+'/'+this.route.snapshot.paramMap.get('section')]);
  }

  s2ab(s:string):ArrayBuffer{
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for(let i=0; i!==s.length; ++i){
      view[i]=s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  downloadReport(){
    console.log("DESCARGANDO!");
    if(this._students && this._states){
      let wb = XLSX.utils.book_new();

      let json_states= JSON.stringify(this._states);
      let json_students = JSON.stringify(this._students);
      XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(this._states));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(this._students));
      const wbout = XLSX.write(wb,this.wopt);
      saveAs(new Blob([this.s2ab(wbout)]), this._filename);
    }

  }

}