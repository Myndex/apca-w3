///////////////////////////////////////////////////////////////////////////////
/** @preserve
/////    SAPC APCA - Advanced Perceptual Contrast Algorithm
/////           Beta 0.1.3 W3 • contrast function only
/////           DIST: W3 • Revision date: Apr 23, 2022
/////    Function to parse color values and determine Lc contrast
/////    Copyright © 2019-2022 by Andrew Somers. All Rights Reserved.
/////    LICENSE: W3 LICENSE
/////    CONTACT: Please use the ISSUES or DISCUSSIONS tab at:
/////    https://github.com/Myndex/SAPC-APCA/
/////
///////////////////////////////////////////////////////////////////////////////
/////
/////    IMPORTS:
/////    import { APCAcontrast, sRGBtoY, displayP3toY,
/////             calcAPCA, fontLookupAPCA } from 'apca-w3';
/////    import { colorParsley } from 'colorparsley';
/////
/////    FORWARD CONTRAST USAGE:
/////    Lc = APCAcontrast( sRGBtoY( TEXTcolor ) , sRGBtoY( BACKGNDcolor ) );
/////    Where the colors are sent as an rgba array [0,0,0,255]
/////
/////    Retrieving an array of font sizes for the contrast:
/////    fontArray = fontLookupAPCA(Lc);
/////
/////
/////    Live Demonstrator at https://www.myndex.com/APCA/
// */
///////////////////////////////////////////////////////////////////////////////

// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name apca-w3.min.js
// @code_url https://raw.githubusercontent.com/Myndex/apca-w3/master/src/apca-w3.js
// ==/ClosureCompiler==


////////////////////////////////////////////////////////////////////////////////
/////
/////                      SAPC Method and APCA Algorithm
/////   W3 Licensed Version: https://github.com/Myndex/apca-w3
/////   GITHUB: https://github.com/Myndex/SAPC-APCA
/////   DEVELOPER SITE: https://www.myndex.com/WEB/Perception
/////
/////   Acknowledgments and Thanks To:
/////   • This project references the research and work of Dr.Lovie-Kitchin, 
/////     Dr.Legge, Dr.Arditi, M.Fairchild, R.Hunt, M.Stone, Dr.Poynton, 
/////     L.Arend, M.Luo, E.Burns, R.Blackwell, P.Barton, M.Brettel, and many 
/////     others — see refs at https://www.myndex.com/WEB/WCAG_CE17polarity
/////   • Bruce Bailey of USAccessBoard for his encouragement, ideas, & feedback
/////   • Chris Loiselle of Oracle for getting us back on track in a pandemic
/////   • The many volunteer test subjects for participating in the studies.
/////   • Principal research conducted at Myndex by A.Somers.
/////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
/////
/////   *****  SAPC BLOCK  *****
/////
/////   For Evaluations, refer to this as: SAPC-8, v0.1.3 G-series constant 4g
/////            SAPC • S-LUV Advanced Predictive Color
/////
/////   SIMPLE VERSION — Only the basic APCA contrast predictor.
/////
/////   Included Extensions & Model Features in this file:
/////       • SAPC-8 Core Contrast (Base APCA, non-clinical use only) 
/////       • G series constants, group "G-4g" using a 2.4 monitor exponent
/////       • sRGB to Y, parses numeric sRGB color to luminance
/////       • SoftToe black level soft clamp and flare compensation.
/////
/////
////////////////////////////////////////////////////////////////////////////////
/////
/////               DISCLAIMER AND LIMITATIONS OF USE
/////     APCA is an embodiment of certain suprathreshold contrast
/////     prediction technologies and it is licensed to the W3 on a
/////     limited basis for use in certain specific accessibility
/////     guidelines for web content only. APCA may be used for 
/////     predicting colors for web content use without royalty.
/////
/////     However, Any such license excludes other use cases
/////     not related to web content. Prohibited uses include
/////     medical, clinical evaluation, human safety related,
/////     aerospace, transportation, military applications, 
/////     and uses which are not specific to web based content
/////     presented on self-illuminated displays or devices.
/////
////////////////////////////////////////////////////////////////////////////////

//////////   APCA 0.1.3  G 4g USAGE  ///////////////////////////////////////////
///
///  The API for "APCA 0.1.3" is trivially simple.
///  Send text and background sRGB numeric values to the sRGBtoY() function,
///  and send the resulting text-Y and background-Y to the APCAcontrast function,
///  it returns a signed float with the numeric Lc contrast result.
///  
///  The two inputs are TEXT color and BACKGROUND color in that order.
///  Each must be a numeric NOT a string, as this simple version has
///  no string parsing utilities. EXAMPLE:
///  ________________________________________________________________________
///
///     txtColor = 0x123456; // color of the text, as will be rendered
///     bgColor  = 0xabcdef; // color for the background, as will be rendered
///
///     contrastLc = APCAcontrast( sRGBtoY(txtColor) , sRGBtoY(bgColor) );
///  ________________________________________________________________________
///
///                  **********   QUICK START   **********
///
///  Each color must be a 24bit color (8 bit per channel) as a single integer
///  (or 0x) sRGB encoded color, i.e. White is either the integer 16777216 or
///  the hex 0xffffff. A float is returned with a positive or negative value.
///  Negative values mean light text and a dark background, positive values
///  mean dark text and a light background. 60.0, or -60.0 is a contrast
///  "sort of like" the old WCAG 2's 4.5:1. NOTE: the total range is now less
///  than ± 110, so output can be rounded to a signed INT but DO NOT output
///  an absolute value - light text on dark BG should return a negative number.
///
///     *****  IMPORTANT: Do Not Mix Up Text and Background inputs.  *****
///     ****************   APCA is polarity dependent!   *****************
///  
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
/////  BEGIN APCA  0.1.3  BLOCK         \//////////////////////////////////////
////                                     \////////////////////////////////////

import { colorParsley, colorToHex, colorToRGB } from '../node_modules/colorparsley/src/colorparsley.js';


//////////  ƒ  APCAcontrast()  /////////////////////////////////////////////
export function APCAcontrast (txtY,bgY,places = -1) {
                 // send linear Y (luminance) for text and background.
                // txtY and bgY must be between 0.0-1.0
               // IMPORTANT: Do not swap, polarity is important.

  const icp = [0.0,1.1];     // input range clamp / input error check

  if(isNaN(txtY)||isNaN(bgY)||Math.min(txtY,bgY)<icp[0]||Math.max(txtY,bgY)>icp[1]){
    return 0.0;  // return zero on error
    // return 'error'; // optional string return for error
  };

//////////   APCA 0.1.3   G - 4g - W3 Constants   ///////////////////////

  const normBG = 0.56, 
        normTXT = 0.57,
        revTXT = 0.62,
        revBG = 0.65;  // G-4g constants for use with 2.4 exponent

  const blkThrs = 0.022,
        blkClmp = 1.414, 
        scaleBoW = 1.14,
        scaleWoB = 1.14,
        loBoWoffset = 0.027,
        loWoBoffset = 0.027,
        loClip = 0.1,
        deltaYmin = 0.0005;

//////////   SAPC LOCAL VARS   /////////////////////////////////////////

  let SAPC = 0.0;            // For raw SAPC values
  let outputContrast = 0.0; // For weighted final values
  let polCat = 'BoW';        // Alternate Polarity Indicator. N normal R reverse

  // TUTORIAL

  // Use Y for text and BG, and soft clamp black,
  // return 0 for very close luminances, determine
  // polarity, and calculate SAPC raw contrast
  // Then scale for easy to remember levels.

  // Note that reverse contrast (white text on black)
  // intentionally returns a negative number
  // Proper polarity is important!

//////////   BLACK SOFT CLAMP   ////////////////////////////////////////

          // Soft clamps Y for either color if it is near black.
  txtY = (txtY > blkThrs) ? txtY :
                            txtY + Math.pow(blkThrs - txtY, blkClmp);
  bgY = (bgY > blkThrs) ? bgY :
                          bgY + Math.pow(blkThrs - bgY, blkClmp);

       ///// Return 0 Early for extremely low ∆Y
  if ( Math.abs(bgY - txtY) < deltaYmin ) { return 0.0; }


//////////   APCA/SAPC CONTRAST - LOW CLIP (W3 LICENSE)  ///////////////

  if ( bgY > txtY ) {  // For normal polarity, black text on white (BoW)

           // Calculate the SAPC contrast value and scale
      
    SAPC = ( Math.pow(bgY, normBG) - Math.pow(txtY, normTXT) ) * scaleBoW;

            // Low Contrast smooth rollout to prevent polarity reversal
           // and also a low-clip for very low contrasts
    outputContrast = (SAPC < loClip) ? 0.0 : SAPC - loBoWoffset;

  } else {  // For reverse polarity, light text on dark (WoB)
           // WoB should always return negative value.
	polCat = 'WoB';

    SAPC = ( Math.pow(bgY, revBG) - Math.pow(txtY, revTXT) ) * scaleWoB;

    outputContrast = (SAPC > -loClip) ? 0.0 : SAPC + loWoBoffset;
  }

         // return Lc (lightness contrast) as a signed numeric value 
        // Round to the nearest whole number as string is optional.
       // Rounded can be a signed INT as output will be within ± 127 
      // places = -1 returns signed float, 1 or more set that many places
     // 0 returns rounded string, uses BoW or WoB instead of minus sign

  if(places < 0 ){  // Default (-1) number out, all others are strings
    return  outputContrast * 100.0;
  } else if(places == 0 ){
    return  Math.round(Math.abs(outputContrast)*100.0)+'<sub>'+polCat+'</sub>';
  } else if(Number.isInteger(places)){
    return  (outputContrast * 100.0).toFixed(places);
  } else { return 0.0 }

} // End APCAcontrast()



//////////  ƒ  findBg()  //////////////////////////////////////////////////
export function reverseAPCA (contrast = 0,knownY = 1.0,knownType = 'bg',returnAs = 'hex') {
    
  if (Math.abs(contrast) < 5) { return false }; // abs contrast must be > 5
  
  let unknownY = knownY, knownExp, unknownExp;
  
  const mainTRCencode = 1/2.4,
        normBG = 0.56, 
        normTXT = 0.57,
        revTXT = 0.62,
        revBG = 0.65;  // G-4g constants for use with 2.4 exponent

  const blkThrs = 0.022,
        blkClmp = 1.414, 
        scale = 1.14,
        offset = contrast > 0 ? 0.027 : -0.027;

///// MAGIC NUMBERS for UNCLAMP, for use with 0.022 & 1.414 /////
  const mFactor = 1.94685544331710;
  const mFactInv = 1/mFactor;
  const mOffsetIn = 0.03873938165714010;
  const mExpAdj = 0.2833433964208690;
  const mExp = mExpAdj / blkClmp;
  const mOffsetOut = 0.3128657958707580;

    contrast = ( parseFloat(contrast) * 0.01 + offset ) / scale;

              // Soft clamps Y if it is near black.
    knownY = (knownY > blkThrs) ? knownY :
                                  knownY + Math.pow(blkThrs - knownY, blkClmp);
                                  
       // set the known and unknown exponents
    if (knownType == 'bg' || knownType == 'background') {
        knownExp = contrast > 0 ? normBG : revBG;
        unknownExp = contrast > 0 ? normTXT : revTXT;
        unknownY = Math.pow( Math.pow(knownY,knownExp) - contrast, 1/unknownExp );
        if (isNaN(unknownY)) return false;
    } else if (knownType == 'txt' || knownType == 'text') {
        knownExp = contrast > 0 ? normTXT : revTXT;
        unknownExp = contrast > 0 ? normBG : revBG;
        unknownY = Math.pow(contrast + Math.pow(knownY,knownExp), 1/unknownExp );
        if (isNaN(unknownY)) return false;
    } else { return false } // return false on error

    //return contrast +'----'+unknownY;

    if (unknownY > 1.06 || unknownY < 0) { return false } // return false on overflow
    // if (unknownY < 0) { return false } // return false on underflow
    //unknownY = Math.max(unknownY,0.0);
    
                //  unclamp
    unknownY = (unknownY > blkThrs) ? unknownY : 
    (Math.pow(((unknownY + mOffsetIn) * mFactor), mExp) * mFactInv) - mOffsetOut;
    
//    unknownY - 0.22 * Math.pow(unknownY*0.5, 1/blkClmp);

    unknownY = Math.max(Math.min(unknownY,1.0),0.0);

  if (returnAs === 'hex') {
    let hexB = ( Math.round(Math.pow(unknownY,mainTRCencode) * 255)
                ).toString(16).padStart(2,'0');
                
    return  '#' + hexB + hexB + hexB;
  } else if (returnAs === 'color') {
    let colorB = Math.round(Math.pow(unknownY,mainTRCencode) * 255);
    let retUse = (knownType == 'bg') ? 'txtColor' : 'bgColor'
    return  [colorB,colorB,colorB,1,retUse];
  } else if (returnAs === 'Y' || returnAs === 'y') {
    return  Math.max(0.0,unknownY);
  } else { return false } // return knownY on error
}



//////////  ƒ  sRGBtoY()  //////////////////////////////////////////////////
export function sRGBtoY (rgb = [0,0,0]) { // send sRGB 8bpc (0xFFFFFF) or string

// NOTE: Currently expects 0-255

/////   APCA 0.1.3   G - 4g - W3 Constants   ////////////////////////

const mainTRC = 2.4; // 2.4 exponent emulates actual monitor perception
    
const sRco = 0.2126729, 
      sGco = 0.7151522, 
      sBco = 0.0721750; // sRGB coefficients
      
// Future:
// 0.2126478133913640	0.7151791475336150	0.0721730390750208
// Derived from:
// xW	yW	K	xR	yR	xG	yG	xB	yB
// 0.312720	0.329030	6504	0.640	0.330	0.300	0.600	0.150	0.060

         // linearize r, g, or b then apply coefficients
        // and sum then return the resulting luminance

  function simpleExp (chan) { return Math.pow(chan/255.0, mainTRC); };

  return sRco * simpleExp(rgb[0]) +
         sGco * simpleExp(rgb[1]) +
         sBco * simpleExp(rgb[2]);
         
} // End sRGBtoY()






//////////  ƒ  displayP3toY()  /////////////////////////////////////////////
export function displayP3toY (rgb = [0,0,0]) { // send rgba array

// NOTE: Currently Apple has the tuple as 0.0 to 1.0, NOT 255

/////   APCA 0.1.3   G - 4g - W3 Constants   ////////////////////////

const mainTRC = 2.4; // 2.4 exponent emulates actual monitor perception
                    // Pending evaluation, because, Apple...
    
const sRco = 0.2289829594805780, 
      sGco = 0.6917492625852380, 
      sBco = 0.0792677779341829; // displayP3 coefficients

// Derived from:
// xW	yW	K	xR	yR	xG	yG	xB	yB
// 0.312720	0.329030	6504	0.680	0.320	0.265	0.690	0.150	0.060

         // linearize r, g, or b then apply coefficients
        // and sum then return the resulting luminance

  function simpleExp (chan) { return Math.pow(chan, mainTRC); };

  return sRco * simpleExp(rgb[0]) +
         sGco * simpleExp(rgb[1]) +
         sBco * simpleExp(rgb[2]);

} // End displayP3toY()





//////////  ƒ  adobeRGBtoY()  /////////////////////////////////////////////
export function adobeRGBtoY (rgb = [0,0,0]) { // send rgba array

// NOTE: Currently expects 0-255

/////   APCA 0.1.3   G - 4g - W3 Constants   ////////////////////////

const mainTRC = 2.35; // 2.35 exponent emulates actual monitor perception
                     // Pending evaluation...
    
const sRco = 0.2973550227113810, 
      sGco = 0.6273727497145280, 
      sBco = 0.0752722275740913; // adobeRGB coefficients

// Derived from:
// xW	yW	K	xR	yR	xG	yG	xB	yB
// 0.312720	0.329030	6504	0.640	0.330	0.210	0.710	0.150	0.060

         // linearize r, g, or b then apply coefficients
        // and sum then return the resulting luminance

  function simpleExp (chan) { return Math.pow(chan/255.0, mainTRC); };

  return sRco * simpleExp(rgb[0]) +
         sGco * simpleExp(rgb[1]) +
         sBco * simpleExp(rgb[2]);

} // End displayP3toY()




//////////  ƒ  alphaBlend()  /////////////////////////////////////////////
 
                      // send rgba array for top, rgb for bottom.
                     // Only foreground has alpha of 0.0 to 1.0 
                    // This blends using gamma encoded space (standard)
                   // rounded 0-255 or set isInt false for float 0.0-1.0
export function alphaBlend (rgbaFG=[0,0,0,1.0], rgbBG=[0,0,0], isInt = true ) {
	
	rgbaFG[3] = Math.max(Math.min(rgbaFG[3], 1.0), 0.0); // clamp alpha
	let compBlend = 1.0 - rgbaFG[3];
	let rgbOut = [0,0,0]; // or just use rgbBG to retain other elements?
	
	for (let i=0;i<3;i++) {
		rgbOut[i] = rgbBG[i] * compBlend + rgbaFG[i] * rgbaFG[3];
		if (isInt) rgbOut[i] = Math.min(Math.round(rgbOut[i]),255);
	};
  return rgbOut;
} // End alphaBlend()



//////////  ƒ  calcAPCA()  /////////////////////////////////////////////
export function calcAPCA (textColor, bgColor, places = -1, isInt = true) {
        
        // Note that this function requires colorParsley !!
	let bgClr = colorParsley(bgColor);
	let txClr = colorParsley(textColor);
	let hasAlpha = (txClr[3] == '' || txClr[3] == 1) ? false : true ;

	if (hasAlpha) { txClr = alphaBlend( txClr, bgClr, isInt); };
	
	return APCAcontrast( sRGBtoY(txClr), sRGBtoY(bgClr), places)
} // End calcAPCA()




//////////  ƒ  fontLookupAPCA()  ///////////////////////////////////////
export function fontLookupAPCA (contrast) {

  // APCA CONTRAST FONT LOOKUP TABLES
  // Copyright © 2022 by Myndex Research and Andrew Somers. All Rights Reserved
  // Public Beta 0.1.5b (G) • APRIL 23 2022 (minor cleanup)
  // For the following arrays, the Y axis is contrastArrayLen
  // The two x axis are weightArrayLen and scoreArrayLen
  // APRIL 23  2022
  const contrastArrayAscend = ['lc',0,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,120,];
  const contrastArrayLenAsc = contrastArrayAscend.length; // Y azis

  const weightArray = [0,100,200,300,400,500,600,700,800,900];
  const weightArrayLen = weightArray.length; // X axis

  let returnArray = [contrast.toFixed(3),0,0,0,0,0,0,0,0,0,];
  const returnArrayLen = returnArray.length; // X axis


  contrast = Math.abs(contrast);
  const factor = 0.2; // 1/5
  let index = (contrast * factor) | 0 ; // n|0 is bw floor


///////////////////////////////////////////////////////////////////////////////

/////  CONTRAST * FONT WEIGHT & SIZE  //////////////////////////////////////

// Font size interpolations. Here the chart was re-ordered to put
// the main contrast levels each on one line, instead of font size per line.
// First column is LC value, then each following column is font size by weight

// G G G G G G  UPDATED JAN 31 2022 
// ADJUSTED FOR G Interpolation 

// Lc values under 70 should have Lc 15 ADDED if used for body text
// All font sizes are in px and reference font is Barlow

// 999: prohibited - too low contrast
// 777: NON TEXT at this minimum weight stroke
// 666 - this is for spot text, not fluent-Things like copyright or placeholder.
// 5xx - minimum font at this weight for content, 5xx % 500 for font-size
// 4xx - minimum font at this weight for any purpose], 4xx % 400 for font-size

// MAIN FONT SIZE LOOKUP Jan 31 2022  Sorted by Lc Value

//// ASCENDING SORTED  APRIL 23 2022 ////
//// Lc 45 * 0.2 = 9 which is the index for the row for Lc 45

  const fontMatrixAscend = [
  ['Lc',100,200,300,400,500,600,700,800,900],
  [0,999,999,999,999,999,999,999,999,999],
  [10,999,999,999,999,999,999,777,777,777],
  [15,999,999,777,777,777,777,120,120,120],
  [20,999,777,777,777,120,120,110,88,66],
  [25,999,777,777,120,102,87,72,57.5,43],
  [30,999,777,120,96,68,58,48,38.5,29],
  [35,777,120,93.5,66,46.5,40,33,26.5,20],
  [40,777,96,68,48,34,29,24,20,18],
  [45,120,72,51,36,28,24,20,18,418],
  [50,96.5,58,41,29,25,20,18,17,418],
  [55,86.5,52,37,26,22,19.5,17,16,418],
  [60,80,48,34,24,21,18,16,416,418],
  [65,71.5,43,30.5,21.5,19.5,17,15,416,418],
  [70,65,39,27.5,19.5,18,16,14.5,416,418],
  [75,60,36,24,18,17,15,14,416,418],
  [80,56.5,34,23,17,16,14.5,414,416,418],
  [85,53.5,32,22,16,15,14,414,416,418],
  [90,50,30,21,15,14.5,414,414,416,418],
  [95,48.5,29,20.5,14.5,14,414,414,416,418],
  [100,46.5,28,18,14,414,414,414,416,418],
  [105,445,427,417,413.5,413.5,413.5,413.5,416,418],
  [120,445,427,417,413.5,413.5,413.5,413.5,416,418],
  ];

  // G G G G G G UPDATED JAN 31 2022 
  // interpolation G  
  // MAIN FONT SIZE DELTA PRECALC
//// ASCENDING SORTED  APRIL 23 2022 ////
//// ROWS BELOW ////

  const fontDeltaAscend = [ 
  ['Lc∆h',100,200,300,400,500,600,700,800,900,],
  [0,0,0,0,0,0,0,0,0,0,],
  [10,0,0,0,0,0,0,0,0,0,],
  [15,0,0,0,0,0,0,10,32,54,],
  [20,0,0,0,0,18,33,38,30.5,23,],
  [25,0,0,0,24,34,29,24,19,14,],
  [30,0,0,26.5,30,21.5,18,15,12,9,],
  [35,0,24,25.5,18,12.5,11,9,6.5,2,],
  [40,0,24,17,12,6,5,4,2,0,],
  [45,23.5,14,10,7,3,4,2,1,0,],
  [50,10,6,4,3,3,0.5,1,1,0,],
  [55,6.5,4,3,2,1,1.5,1,0,0,],
  [60,8.5,5,3.5,2.5,1.5,1,1,0,0,],
  [65,6.5,4,3,2,1.5,1,0.5,0,0,],
  [70,5,3,3.5,1.5,1,1,0.5,0,0,],
  [75,3.5,2,1,1,1,0.5,0,0,0,],
  [80,3,2,1,1,1,0.5,0,0,0,],
  [85,3.5,2,1,1,0.5,0,0,0,0,],
  [90,1.5,1,0.5,0.5,0,0,0,0,0,],
  [95,2,1,2.5,0.5,0,0,0,0,0,],
  [100,1.5,1,1,0.5,0.5,0.5,0.5,0,0,],
  [105,0,0,0,0,0,0,0,0,0,],
  [120,0,0,0,0,0,0,0,0,0,],
  ];

///////////////////////////////////////////////////////////////////////////
/////////  Font and Score Interpolation  \////////////////////////////////

  let tempFont = 777;
  let scoreAdj = 0.1;
  let w = 0;

  // populate returnArray with interpolated values

  // returnArray[w] = contrast;
  scoreAdj = (contrast - fontMatrixAscend[index][w]) * factor;
  w++;
  
  for (; w < weightArrayLen; w++) {

    tempFont = fontMatrixAscend[index][w]; 

    if (tempFont > 400) {
        returnArray[w] = tempFont;
    } else if (contrast < 41.0 ) {
        returnArray[w] = 666;
    } else {
                // INTERPOLATION OF FONT SIZE
               // sets level for 0.5 size increments of smaller fonts
              // Note bitwise (n|0) instead of floor
      (tempFont > 24) ?
        returnArray[w] = 
            Math.round(tempFont - (fontDeltaAscend[index][w] * scoreAdj)) :
        returnArray[w] = 
            tempFont - ((2.0 * fontDeltaAscend[index][w] * scoreAdj) | 0) * 0.5;
                                                            // (n|0) is bw floor
    }
  }
/////////\  End Interpolation   ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

  return returnArray
}


////\                                 //////////////////////////////////////////
/////\  END APCA 0.1.3  G-4g  BLOCK  //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
