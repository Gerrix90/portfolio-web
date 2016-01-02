import {Icon, City}   from './city';
import * as p         from './points';

declare var lived:string, prevIcon:Icon;
lived = 'I\'ve lived here...';
prevIcon = {url: 'assets/images/markerprev.png', size: p.MARKER_SIZE};

export var CITIES:Array<City> = [
  {
    loc: p.HARTSWATER,
    title: 'I was born here...',
    icon: prevIcon
  }, {
    loc: p.HEIDELBERG,
    title: 'I grew up here...',
    icon: prevIcon
  }, {
    loc: p.VRYBURG,
    title: 'I went to High School here...',
    icon: prevIcon
  }, {
    loc: p.LONGON,
    title: lived,
    icon: prevIcon
  }, {
    loc: p.BENONI,
    title: lived,
    icon: prevIcon
  }, {
    loc: p.CAPE_TOWN,
    title: 'I moved to NZ from here...',
    icon: prevIcon
  }, {
    loc: p.HAMILTON,
    title: lived,
    icon: prevIcon
  }, {
    loc: p.AUCKLAND,
    title: lived,
    icon: prevIcon
  }, {
    loc: p.MT_COOK,
    title: 'I\'m in this area...',
    icon: {
      url: 'assets/images/markercur.png',
      size: p.MARKER_SIZE
    }
  }
];
