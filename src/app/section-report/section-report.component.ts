import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import {saveAs} from 'file-saver';
import * as XLSX from 'xlsx'; 
import * as XlsxPopulate from 'xlsx-populate';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';

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
  private _loggedUser;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  /*Estados
    'Activo',
    'Riesgo',
    'NSP',
    'Traslado',
    'Exclusión',
    'Ausente'
  */


  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private route: ActivatedRoute) { 
    this._states = [
      {
        name:'Activo',
        amount: 0
      },
      {
        name:'Exclusión',
        amount: 0
      },
      {
        name:'NSP',
        amount: 0
      },
      {
        name:'Traslado',
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
    
    this.afAuth.authState.takeUntil(this.ngUnsubscribe).subscribe(authUser=>{
      if(!authUser){
        this.router.navigate(['']);
      }
      else{
        this._loggedUser = this.db.object('/users/'+authUser.uid).subscribe((user)=>{
          this._loggedUser = user;
        });
        this._school = this.db.object('/schools/'+this.route.snapshot.paramMap.get('school'));
        
        this.db.object('/sections/'+this.route.snapshot.paramMap.get('section'))
          .takeUntil(this.ngUnsubscribe).subscribe((section)=>{
            this._section = section;
            this._date = new Date();
            this._filename = section.course+"-"+section.section+"-"+this._date.getDate()+'/'+this._date.getMonth()+'/'+this._date.getFullYear()+'.xlsx';
        });

        this.db.list('/students', {
            query: {
              orderByChild:'section',
              equalTo: this.route.snapshot.paramMap.get('section')
            }
        }).take(1).subscribe((students) =>{
          this._students = [];
          
          students.forEach(element => {
            this._students.push({
              name: element.firstName +' '+ element.secondName+' '+ element.firstLastName+' '+ element.secondLastName,
              state: element.state,
              stateModified: element.stateModified
            })

            if(element.state == "Activo" || element.state == "Ausente"){
              this._states[0].amount++;
            }

            else if(element.state == "Exclusión"){
              this._states[1].amount++;
            }
            
            else if(element.state == "NSP"){
              this._states[2].amount++;
            }
            
            else if(element.state == "Traslado"){
              this._states[3].amount++;
            }

            else if(element.state == "Riesgo"){
              this._states[4].amount++;
            }
          });

          this._students.sort(function(a,b){
            return a.name.localeCompare(b.name);
          });

          for(let i=0; i<this._states.length-1; i++){
            //console.log(this._states[5].amount +" - "+ this._states[i].amount);
            this._states[5].amount += this._states[i].amount;
          }
        });
      }     
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>this.router.navigate(['']));
  }

  goStudents() {
    this.router.navigate(['/students/'+this.route.snapshot.paramMap.get('school')+'/'+this.route.snapshot.paramMap.get('section')]);
  }

  formatDate(date){
    let _date = new Date(date);
    return _date.getDate()+'/'+(_date.getMonth()+1)+'/'+_date.getFullYear();
  }

  s2ab(s:string):ArrayBuffer{
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for(let i=0; i!==s.length; ++i){
      view[i]=s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  altDownloadReport(){
    if(this._students && this._states){
      XlsxPopulate.fromBlankAsync().then(workbook =>{
        let secondTableStart = this._states.length+4
        console.log(workbook);

        //Rangos de la tablas
        let rangeFirstTable= "A1:B"+(this._states.length+1);
        let rangeSecondTable= "A"+secondTableStart +":C"+(secondTableStart+this._students.length);
        
        //Agregando borde a la primera tabla
        workbook.sheet(0).range(rangeFirstTable).style({
          leftBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
          rightBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
          topBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
          bottomBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
        });

        //Agregando borde a la segunda tabla
        workbook.sheet(0).range(rangeSecondTable).style({
          leftBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
          rightBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
          topBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
          bottomBorder:{
            style:'thin',
            color:{
              rgb:'000000'
            }
          },
        });
        
        //Ancho de la columnas
        workbook.sheet(0).column("A").width(40);
        workbook.sheet(0).column("B").width(25);
        workbook.sheet(0).column("C").width(25);

        //Headers de la primera tabla
        workbook.sheet(0).cell("A1").value("Estado");
        workbook.sheet(0).cell("A1").style({
          bold:true, 
          fill:{
            type:'solid',
            color:{
              rgb:'c0c0c0'
            }
          }
        });

        workbook.sheet(0).cell("B1").value("Estudiantes");
        workbook.sheet(0).cell("B1").style({
          bold:true, 
          fill:{
            type:'solid',
            color:{
              rgb:'c0c0c0'
            }
          }
        });

        //Ciclo para agregar el contenido de la tabla
        for(let i=0; i<this._states.length; i++){

          //Indices de cada celda. El indice del arreglo más 2 contando que
          //la celda de header y que el arreglo empieza en 0 pero la tabla no.
          let index_a = 'A'+(i+2);
          let index_b = 'B'+(i+2);

          if(this._states[i].name== "Total"){
            workbook.sheet(0).cell(index_a).value(this._states[i].name).style("bold",true);
            workbook.sheet(0).cell(index_b).value(this._states[i].amount).style("bold",true);  
          }
          else{
            workbook.sheet(0).cell(index_a).value(this._states[i].name);
            workbook.sheet(0).cell(index_b).value(this._states[i].amount);
          }
        }

        //Headers de la segunda tabla
        workbook.sheet(0).cell("A"+secondTableStart).value("Nombre");
        workbook.sheet(0).cell("B"+secondTableStart).value("Estado");
        workbook.sheet(0).cell("C"+secondTableStart).value("Último cambio");

        workbook.sheet(0).cell("A"+secondTableStart).style({
          bold:true, 
          fill:{
            type:'solid',
            color:{
              rgb:'c0c0c0'
            }
          }
        });
        workbook.sheet(0).cell("B"+secondTableStart).style({
          bold:true, 
          fill:{
            type:'solid',
            color:{
              rgb:'c0c0c0'
            }
          }
        });
        workbook.sheet(0).cell("C"+secondTableStart).style({
          bold:true, 
          fill:{
            type:'solid',
            color:{
              rgb:'c0c0c0'
            }
          }
        });

        //Ciclo para agregar contenido de la segunta tabla
        for(let i=0; i<this._students.length; i++){
          //Indices de cada celda. El indice del arreglo más 2 contando que
          //la celda de header y que el arreglo empieza en 0 pero la tabla no.
          //más una separación de tres celdas entre cada tabla.
          let index_a = 'A'+(secondTableStart+i+1);
          let index_b = 'B'+(secondTableStart+i+1);
          let index_c = 'C'+(secondTableStart+i+1);

          workbook.sheet(0).cell(index_a).value(this._students[i].name);
          workbook.sheet(0).cell(index_b).value(this._students[i].state);
          workbook.sheet(0).cell(index_c).value(this.formatDate(this._students[i].stateModified));
        }

        //Exportando como blob y usando saveAs para descargarlo
        workbook.outputAsync().then((blob)=>{
          saveAs(blob, this._filename);
        });
        
      });
      
    }
  }

  //ESTE METODO QUEDA EN CASO QUE EL METODO DE DESCARGA DEJE DE FUNCIONAR
  //COMO ALTERNATIVA
  /*downloadReport(){
    console.log("DESCARGANDO!");
    if(this._students && this._states){
      let wb = XLSX.utils.book_new();
      
      let secondTableStart = this._states.length+4
      let refIndex= "A1:B"+(secondTableStart+this._students.length);

      let resumen = {
        "!ref":refIndex
      }

      resumen['A1'] = {t:"s", v:"Estado", s:{font:{bold:true}}};
      resumen['B1'] = {t:"s", v:"Estudiantes", s:{font:{bold:true}}};
      for(let i=0; i<this._states.length; i++){
        let index_a = 'A'+(i+2);
        let index_b = 'B'+(i+2);
        resumen[index_a] = {t:"s", v:this._states[i].name};
        resumen[index_b] = {t:"n", v:this._states[i].amount};
      }

      resumen['A'+secondTableStart] = {t:"s", v:"Nombre"};
      resumen['B'+secondTableStart] = {t:"s", v:"Estado"};

      for(let i=0; i<this._students.length; i++){
        let index_a = 'A'+(secondTableStart+i+1);
        let index_b = 'B'+(secondTableStart+i+1);
        resumen[index_a] = {t:"s", v:this._students[i].name};
        resumen[index_b] = {t:"n", v:this._students[i].state};
      }

      XLSX.utils.book_append_sheet(wb,resumen,'Resumen');

      console.log(wb.Sheets['Resumen']);
      const wbout = XLSX.write(wb,this.wopt);
      saveAs(new Blob([this.s2ab(wbout)]), this._filename);
    }

  }*/

}
