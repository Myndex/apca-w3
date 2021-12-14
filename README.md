<p align="center">
 <img src="images/APCAlogo.png"  alt="APCA The Revolution Will Be Readable" width="420"><br><br>
    
  <a href="https://github.com/Myndex/SAPC-APCA">
    <img src="https://badgen.net/badge/SAPC/Main Repo/db6b0b" alt="SAPC/Main Repo" />
  </a> &nbsp;&nbsp;  
  <a href="https://npmjs.org/package/apca-w3">
    <img src="https://badgen.net/npm/v/apca-w3?color=3000c0&icon=npm" alt="version" />
  </a> &nbsp;&nbsp;
  <a href="https://github.com/Myndex/apca-w3/src/">
    <img src="https://badgen.net/badge/JS/Vanilla/889900" alt="plain vanilla JS" />
  </a> &nbsp;&nbsp;
  <a href="https://github.com/Myndex/apca-w3/blob/master/LICENSE.md">
    <img src="https://badgen.net/badge/license/W3 • Web Use?icon=github&color=BB5FD1" alt="license" />
  </a> &nbsp;&nbsp;
</p>
<p align="center">
  <a href="https://github.com/Myndex/apca-w3">
    <img src="https://badgen.net/github/last-commit/Myndex/apca-w3/?icon=github" alt="last commit" />
  </a> &nbsp;&nbsp;
  <a href="https://npmjs.org/package/apca-w3">
    <img src="https://badgen.net/npm/dt/apca-w3?color=6000b0&icon=npm" alt="downloads" />
  </a> &nbsp;&nbsp;
  <a href="https://twitter.com/MyndexResearch">
    <img src="https://badgen.net/badge/@/MyndexResearch?icon=twitter" alt="twitter" />
  </a> &nbsp;&nbsp;
  <a href="https://github.com/Myndex/SAPC-APCA">
    <img src="https://badgen.net/badge/APCA/Live Tool/db6b0b" alt="APCA/Live Tool/" />
  </a> &nbsp;&nbsp;    
</p>

# APCA for W3 & WCAG\_3
## apca-w3
The APCA version in this repositiory is licensed to the W3/AGWG per the collaborative agreement.

### Advanced Perceptual Contrast Algorithm

Current Version: **0.0.98G-4g.3** (w3) _betafish_

APCA is a contrast assessment method for predicting the perceived contrast between sRGB colors on a computer monitor. It has been developed as an assessment method for W3 Silver/WCAG3 accessibility standards relating to content for computer displays and mobile devices, with a focus on readability and understandability.

## QuickStart

```javascript
    import { APCAcontrast, sRGBtoY, displayP3toY, colorParsley } from 'apca-w3';
```
### *Usage:*
**BREAKING CHANGE:** _0.0.98G-4g.3_ NOW send rgba int **arrays** to sRGBtoY(), use the new colorParsley() if you need to parse a string first.

First color must be text, second color must be the background.
```javascript
    let textColor = [17,17,17,255];
    let backgroundColor = [232,230,221,255];
    let contrastLc = APCAcontrast( sRGBtoY( textColor ), sRGBtoY( backgroundColor ) );
```

If you need to parse, we've kept that, now called "colorParsley()" send it anything, it returns an rgba array. Relative to the above example:

```javascript
    let textColor = colorParsley('#111111');
    let backgroundColor = colorParsley('e8e6dd');
```


The following are the available input types for colorParsley(), HSL is not implemented at the moment. All are automatically recognized:

### INPUT as STRINGS:
- **No Alpha**
    - ` '#abc' ` or ` 'abc' ` (interpreted as ` 'aabbcc' `)
    - ` '#abcdef' ` or ` 'abcdef' ` (hash is ignored)
    - ` 'rgb(123, 45, 67)' `
    - ` 'aquamarine' ` or ` 'magenta' ` (full CSS4 named colors list)

- **With Alpha** _(alpha is NOT presently calculated, and assumed as fully opaque)_
    - ` '#abcf' ` or ` 'abcf' ` (interpreted as ` 'aabbccff' `)
    - ` '#123456ff' ` or ` '123456ff' ` (hash is ignored)
    - ` 'rgba(123, 45, 67,255)' `

### INPUT as NUMBER:
- **As hex**
    - ` 0xabcdef `
- **As integer**
    - ` 11259375 `

No alpha parsing for _numbers_ in part as there are big and little endian issues that need to be resolved.

### _BREAKING CHANGE:_
 The parsing was be moved to a separate function, colorParsley(), and sRGBtoY will now take only an rgba array in the form of rgba = [0,0,0,255] this is in keeping with comments that the parsing is not always necessarry, and rather raw data is preferred.
 
 This should be the last "breaking" change for a while.
 
### Parsing Removal
in the src folder .js file, there is a ` /*/ ` type code toggle you can disable the entire set of parsing functions before minimizing. this changes the import to:

```javascript
             // import with parsing off:
    import { APCAcontrast, sRGBtoY, displayP3toY } from 'apca-w3';
```


### Font Use Lookup Table
Latest Lookup Table: November 17 2021

<img width="639" alt="0.0.98G4gLUT" src="images/0.0.98G4gLUT.png">

<img width="596" alt="0.0.98G4gLUT legend" src="images/0.0.98G4gLUT-legend.png">

```javascript
// APCA FONT LOOKUP TABLE 0.98G-4g-b3
// Font Size and Reference Font Weight
// THIS GRID FOR FLUENT TEXT USE CASE ONLY DEC 12 2021

const apcaFluentGrid = [
   ["min", "min", "min", "min", "min", "min", "min", "min", "min"],
   ["min", "min", "min", "min", "min", "min", "min", "min", "min"],
   ["min", "min", "min", 95, 90, 85, 80, "min", "min"],
   ["min", "min", "min", 90, 85, 80, 75, "min", "min"],
   ["min", "min", 95, 75, 70, 65, 60, 55, "min"],
   ["min", "min", 90, 70, 65, 60, 55, 50, 45],
   ["min", 95, 85, 65, 60, 55, 50, 45, 40],
   ["min", 90, 75, 60, 55, 50, 45, 40, 35],
   ["min", 85, 70, 55, 50, 45, 40, 35, 30],
   [90, 75, 60, 50, 45, 40, 35, 30, "max"],
   [85, 70, 55, 45, 40, 35, 30, "max", "max"],
   [75, 60, 50, 40, 35, 30, "max", "max", "max"],
   [70, 55, 45, 35, 30, "max", "max", "max", "max"],
   [60, 45, 40, 30, "max", "max", "max", "max", "max"],
 ];
```

-----
## EXTRAS
Additional documentation, including a plain language walkthrough, LaTeX math, and more are available [at the SAPC repo.](https://github.com/Myndex/SAPC-APCA)

### Current APCA Constants ( 0.0.98G 4g - W3 )
**These constants are for use with the web standard sRGB colorspace.**
```javascript
 // 0.98G-4g-W3 constants (W3 license only):
    
  Exponents =  { mainTRC: 2.4,       normBG: 0.56,       normTXT: 0.57,     revTXT: 0.62,     revBG: 0.65, };
  
  ColorSpace = { sRco: 0.2126729,    sGco: 0.7151522,    sBco: 0.0721750, };
    
  Clamps =     { blkThrs: 0.022,     blkClmp: 1.414,     loClip: 0.1,     deltaYmin: 0.0005, };
        
  Scalers =    { scaleBoW: 1.14,     loBoWoffset: 0.027, 
                 scaleWoB: 1.14,     loWoBoffset: 0.027, };	
```    

----- 
### [LIVE VERSION][APCAsite]
There is a working version with examples and reference material on [the APCA site][APCAsite]

[APCAsite]: https://www.myndex.com/APCA/

[![](https://raw.githubusercontent.com/Myndex/SAPC-APCA/master/images/Myndex_eye_cielabWide.png)](https://github.com/Myndex)

### APCA is the _Advanced Perceptual Contrast Algorithm_
## THE REVOLUTION WILL BE READABLE™


