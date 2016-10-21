'use strict';
import {Injectable} from '@angular/core';
import {LINKS} from '../models/links';
import {Link} from '../definitions/link';

@Injectable()
export class FooterService {

  getLinks(): Promise<Array<Link>> {
    return Promise.resolve(LINKS);
  }
}
