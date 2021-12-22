# APCA W3 JS Library Documentation
### Updated Dec 21, 2021 for 0.98G-4g W3 npm release

This is a set of JS functions/objects to determine a contrast value for a color pair, using the SAPC/APCA methods. 

These are based on research iteration SAPC-8, developed through a lengthy series of experiments and investigations. They all have a soft black clamp for the darker color, and a basic set of constants for the power curve exponents to predict an estimated perceptual contrast under common use case environments. These are active beta and are receiving updates and changes regularly.

-----

## apca-w3-v.0.0.98g-4g.min.js — SIMPLE QUICK START
This APCA version is the version licensed to the W3/AGWG for use with web content accessibility standards, WCAG 3.

If you want to dive in fast, or you want the bare basics, this is the file for you. This only comes with the most basic color input parsing, and does not containt the automated lookup tables or advanced CIE processing. It is the base APCA algorithim only, with no bells or whistles. Send it two RGB numeric colors and it returns a numeric L<sup>c</sup> contrast value.

## QuickStart
### _Install_

```javascript
    npm i apca-w3
```

### _Import_
```javascript
    import { APCAcontrast, sRGBtoY, displayP3toY, colorParsley } from 'apca-w3';
```
### _Usage:_
PARSE:
If you need to parse a color string or 24bit number, use the colorParsley() function:
```javascript
    let rgbaArray = colorParsley('aliceblue');
```
CONVERT TO Ys
Send rgba INT array [123,123,123,1.0] to sRGBtoY() — this is a slightly different luminance Y that the IEC oiecewise.

```javascript
    let Ys = sRGBtoY([123,123,123,1.0]);
```
FIND Lc CONTRAST
First color _must_ be text, second color must be the background.

```javascript
    let textColor = [17,17,17,255];
    let backgroundColor = [232,230,221,255];
    
    let contrastLc = APCAcontrast( sRGBtoY( textColor ), sRGBtoY( backgroundColor ) );
```
### _String Theory_
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

### Parsing Removal
The function is called "colorParsley()" because what is that useless leafy thing the restaurant puts on the plate?  Well, most mature software already has good parsing, and you may want to minimize the file leaving all that "parsley" at the restaurant.

In the src folder .js file, there is a ` /*/ ` type code toggle, see the comments just before the parsing fucntions. you can disable the entire set of parsing functions before minimizing if you like to go lean and clean.

This changes the import you need to use to:

```javascript
             // import with parsing off/removed:
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
   ["min", "min", 95, 80, 75, 65, 60, 55, "min"],
   ["min", "min", 90, 75, 65, 60, 55, 50, 45],
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

## TESTING YOUR IMPLEMENTATION • APCA 0.98 G-4g

If you've implemented the code and want a quick sanity check,
Here are four keystone checks with no rounding, where the
first color is TEXT and the second color is BACKGROUND.

Each pair of colors is there twice, so you can just swop 
the pair to check polarity. And obviously rounding is
turned off for this check, however for production
you may round to a signed integer. 

    TEXT vs BKGND •  EXPECTED RESULT for 0.98 G-4g
    
    #888 vs #fff  •  63.056469930209424
    #fff vs #888  • -68.54146436644962  
    
    #aaa vs #000  • -56.24113336839742
    #000 vs #aaa  • 58.146262578561334
    
    #def vs #123  • -93.06770049484275
    #123 vs #def  •  91.66830811481631
    
    #123 vs #234  •   1.7512243099356113
    #234 vs #123  •  -1.6349191031377903


Those should exercise the important constants.

-----
Please let us know of any problems, ideas, comments, etc. in the discussion tab at the github repo.

Thank you!

_Andrew Somers     
(User Myndex)_

You can see the current working version at https://www.myndex.com/APCA/

There is more about this project on our main site, https://www.myndex.com/WEB/Perception
