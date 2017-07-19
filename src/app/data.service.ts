import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from 'firebase/app';

@Injectable()
export class DataService {

  public currentUser:Observable<User>

  constructor() { }

}
