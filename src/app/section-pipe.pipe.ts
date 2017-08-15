import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

@Pipe({
  name: 'sectionPipe'
})
export class SectionPipe implements PipeTransform {

  private _section;
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase){

  }

  transform(value:any, args?: any): any {
    return this.db.object('/sections/'+value);
  }

}
