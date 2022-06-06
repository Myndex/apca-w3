import test from 'ava';

import { APCAcontrast, reverseAPCA, sRGBtoY, displayP3toY, adobeRGBtoY, alphaBlend, calcAPCA, fontLookupAPCA } from '../src/apca-w3.js';

console.log('BEGIN TESTS')

test.todo("Testing apca-w3 Lc calculations\n")

let color = ['#000', '#888', '#FFF', '#000', '#aaa', 
    '#123', '#def', '#123', '#444', '#0006','#fff'];
    
let colorLength = color.length - 2;

let contrastResult = [0, 63.056469930209424, -68.54146436644962, 58.146262578561334, -56.24113336839742, 91.66830811481631, -93.06770049484275, 8.32326136957393, -7.526878460278154,54.62184067441377,54.62184067441377 ];



for (let eye = 1, eyePlus; eye < colorLength; eye = eye + 2) {

  eyePlus = eye + 1;
  test('Lc value for ' + color[eye] + ' and ' + color[eyePlus], (t) => {
      t.deepEqual(contrastResult[eye], calcAPCA(color[eye],color[eyePlus]));
  });

  test('Lc value for ' + color[eyePlus] + ' and ' + color[eye], (t) => {
      t.deepEqual(contrastResult[eyePlus], calcAPCA(color[eyePlus],color[eye]));
  });
}

  test('Lc value for ' + color[9] + ' and ' + color[10], (t) => {
      t.deepEqual(contrastResult[9], calcAPCA(color[9],color[10]));
  });

