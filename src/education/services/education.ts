'use strict';
import {Injectable}   from 'angular2/core';
import {Jsonp}        from 'angular2/http';
import {Observable}   from 'angular2/src/facade/async';
import 'rxjs/Rx';
import {SCHOOLS}      from '../models/schools';
import {School}       from '../definitions/school';
import {CodeSchool}   from '../definitions/code.school';
import {wrapError}    from '../../shared/common/wrap.error';

@Injectable()
export class EducationService {
  private _jsonp:Jsonp;

  constructor(jsonp:Jsonp) {
    this._jsonp = jsonp;
  }

  getSchools():Promise<Array<School>> {
    return Promise.resolve(SCHOOLS);
  }

  getCodeSchool():Observable<CodeSchool> {
    return this._jsonp.request('https://www.codeschool.com/users/ouq77.json?callback=JSONP_CALLBACK')
      .map(resp => resp.json())
      .catch(err => wrapError(err));
  }
}
