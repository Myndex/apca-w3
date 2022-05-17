# APCA W3 JS Library Documentation

Current Version: **0.1.3**


#### 0.1.3 • May 17, 2022
Fixed the module imports for colorparsley and apca-w3 so they play well together.
No longer providing a minified version in the dist folder. Now just the file in the src folder.

#### 0.1.2 • April 23, 2022
**NEW!** `fontLookupAPCA(Lc)` Live font lookup table — sent it a contrast, it returns an array of font sizes (in px) for each of 9 weights (100 to 900).

**NEW!** `reverseAPCA(Lc,Y,use,returnAs)` 
New in this version is a reverse contrast lookup. Specify a contrast, and one color (i.e. bg) and it will try to find a color with that contrast.


#### 0.1.1 • Jan 11, 2022
**NEW!** `AlphaBlending()` available! Also added `adobeRGBtoY()`, and a single shortcut function ` calcAPCA() `      
Also, `colorParsley()` is at 0.1.1 for a bug fix for the alpha of a 4 character hex strings.     
Also, revised font lookup table.

#### 0.1.0 • Jan 10, 2022
0.1.0 W3 npm release (version numbering fixed to add to TypeScript)
**NEW:** `displayP3toY()` added!
NOTE: `colorParsley()` is now a dependency in its own package, and colorParsley now supports **HSL** and **HWB**

-----
This is a set of JS functions/objects to determine a contrast value for a color pair, using the SAPC/APCA methods. 

These are based on research iteration SAPC-8, developed through a lengthy series of experiments and investigations. They all have a soft black clamp for the darker color, and a basic set of constants for the power curve exponents to predict an estimated perceptual contrast under common use case environments. These are active beta and are receiving updates and changes regularly.

## _Accessibility Statement for Beta Sites_
Beta testers may wish to include the following statement in their sites boilerplate:
### This website is beta testing the APCA guidelines for determining text and non-text contrast. It is well known that WCAG 2 contrast maths are not accurate regarding human perception, and automated testing using WCAG 2 math may incorrectly indicate errors in some color pairs on this site. The APCA guidelines are a substantial improvement in accessibility over WCAG 2 contrast criterions, and therefore compliant with the ADA, and also 508 rules under the alternative methods section. Any automated or manual testing done to determine conformance of this site needs to be conducted using a perceptually accurate method such as APCA.

## Font Lookup Table
Current as of January 27, 2022

<img src="./images/Jan27_2022LUT_byFont.jpg" alt="January 27, 2022 Font Lookup Table">

<img src="./images/Jan27_2022LUT_legend.jpg" alt="January 27, 2022 Font Table Legend">

<img src="./images/Jan27_2022LUT_byLc.jpg" alt="January 27, 2022 Font Lookup sorted by Lc">

-----

## apca-w3.js — SIMPLE QUICK START
This APCA version is the version licensed to the W3/AGWG for use with web content accessibility standards, WCAG 3.

If you want to dive in fast, or you want the bare basics, this is the file for you. This only comes with the most basic color input parsing, and does not containt the automated lookup tables or advanced CIE processing. It is the base APCA algorithim only, with no bells or whistles. Send it two RGB numeric colors and it returns a numeric L<sup>c</sup> contrast value.

## QuickStart
### _Install_

```javascript
    npm i apca-w3
```

### _Import_
```javascript
<script type="module">

import { APCAcontrast, reverseAPCA, sRGBtoY, displayP3toY, adobeRGBtoY, alphaBlend, calcAPCA, fontLookupAPCA } from './apca-w3.js';

import { colorParsley, colorToHex, colorToRGB } from '../node_modules/colorparsley/src/colorparsley.js';  // optional string parsing

</script>
```

### _Usage:_
**PARSE:**
If you need to parse a color string or 24bit number, use the colorParsley() function:

```javascript
    let rgbaArray = colorParsley('aliceblue');
```
**ALPHA BLEND**
Intended for blending the foreground color into the background. Only the foreground has an alpha. There is no conversion to linear space, so blending takes place is the working colorspace, as is standard.

```javascript
                       // Send 0-255 arrays alphaBlend(FG, BG)
    let alphaBlended = alphaBlend([0,0,0,0.6],colorParsley([255,255,255])),

                       // Send 0-1.0 float arrays for displayP3toY, 5th element
                      // is bool (false for floats): alphaBlend(FG, BG, false)
    let alphaBlended = alphaBlend([0.7,1.0,1.0,0.33],colorParsley([0,0,0]),false);
```

**CONVERT TO Ys**
Send rgba INT array `[123,123,123,1.0] ` to ` sRGBtoY() ` — this is a slightly different luminance Y that the IEC piecewise.

```javascript
    let Ys = sRGBtoY([123,123,123,1.0]);
```
**FIND Lc CONTRAST**
First color _must_ be text, second color must be the background.

```javascript
    let textColor = [17,17,17,1.0];
    let backgroundColor = [232,230,221,1.0];
    
    let contrastLc = APCAcontrast( sRGBtoY( textColor ), sRGBtoY( backgroundColor ) );
```
**Example using everything together, including alphaBlend:**

```javascript

  let colorTEXT =  rgb(12,23,34,0.65);
  let colorBG =  #e6e0dd;
  
  let Lc = APCAcontrast(sRGBtoY( alphaBlend(colorParsley(colorTEXT), colorParsley(colorBG)) ),
                        sRGBtoY( colorParsley(colorBG) ));
```
#### SHORTCUT ALIAS
The long complete line shown above is aliased into a function ` calcAPCA() `. Alpha for the text is automatically detected, and ignored if 1 or ''. The input type is also auto detected (string, king of string, number, array, object). By default returns a signed float -108.0 to 106.0 (approx)

```javascript
    let Lc = calcAPCA(colorTEXT,colorBG);
```

### NEW! Live Font Array Lookup
New in this version is an interpolated font size array. Send `fontLookupAPCA(contrast)` a contrast value, and it returns an array, with the contrast (Lc) as the zeroth element, then 9 font sizes in px corresponding to weights 100 thru 900:

    ['LcValue',100,200,300,400,500,600,700,800,900]

Example:

	  fontArray = fontLookupAPCA(-68.541);

    console.log(fontArray) // -68.541,67,40,28,20.5,18.5,16.5,15,416,418

Thus the 400 weight font is indicating 20.5px


### NEW! Reverse APCA 
New in this version is a reverse contrast lookup. Specify a contrast, and one color (i.e. bg) and it will try to find a color with that contrast.

#### NOTES:
1) Currently only returns a greyscale color
2) If a color can not fit the contrast, or other error, returns false.
    - A small overrun/underrun of a few percent is permitted.
3) Can return a hex string (default) or an array of RGBA values, with the fifth element a string indicating if the color is for text or bg.

    reverseAPCA (Lc, knownY, knownType = 'bg', returnAs = 'hex')

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
    - ` 'rgba(123, 45, 67,1.0)' `

### INPUT as NUMBER:
- **As hex**
    - ` 0xabcdef `
- **As integer**
    - ` 11259375 `

No alpha parsing for _numbers_ in part as there are big and little endian issues that need to be resolved.



### colorParsley() string Parsing Removed, now a dependency
The function is called "colorParsley()" because what is that useless leafy thing the restaurant puts on the plate?  Well, most mature software already has good parsing, and you may want to minimize the file leaving all that "parsley" at the restaurant...

So, colorParsley() is removed from the APCA-W3 file, and is now its own package, listed as a dependency here.

**colorParsley() is required for the shorthand ` calcAPCA() `**


### Two Secret Parameters
There are two extra parameters for calcAPCA(), and one extra for APCAcontrast.

    calcAPCA( text, BG, places, isInt )
    APCAcontrast( txYs, bgYs, places )
    alphaBlend( txt, BG, isInt )

` places ` defaults to -1, but you can send it 0 and the Lc is returned as a rounded value, and instead of a minus sign for polarity, 'WoB' for white on black is returned.

` isInt ` defaults to true, as we assume the RGB tuples are 0-255. If you are sending float such as for displayP3, then set ` isInt = false ``

_NOTE: neither of these are "official" and may change, move, or vanish._

-----
## EXTRAS
Additional documentation, including a plain language walkthrough, LaTeX math, and more are available [at the main SAPC repo.](https://github.com/Myndex/SAPC-APCA)

### Current APCA Constants ( 0.1.3 G - W3 )
**These constants are for use with the web standard sRGB colorspace.**
```javascript
 // 0.1.3 - W3 constants (W3 license only):
    
  Exponents =  { mainTRC: 2.4,       normBG: 0.56,       normTXT: 0.57,     revTXT: 0.62,     revBG: 0.65, };
  
  ColorSpace = { sRco: 0.2126729,    sGco: 0.7151522,    sBco: 0.0721750, };
    
  Clamps =     { blkThrs: 0.022,     blkClmp: 1.414,     loClip: 0.1,     deltaYmin: 0.0005, };
        
  Scalers =    { scaleBoW: 1.14,     loBoWoffset: 0.027, 
                 scaleWoB: 1.14,     loWoBoffset: 0.027, };
                 
///// MAGIC NUMBERS for UNCLAMP, used only with reverseAPCA() /////
////  for use with blkThrs: 0.022 & blkClmp: 1.414 /////

  const mFactor = 1.94685544331710;
  const mFactInv = 1/mFactor;
  const mOffsetIn = 0.03873938165714010;
  const mExpAdj = 0.2833433964208690;
  const mExp = mExpAdj / blkClmp;
  const mOffsetOut = 0.3128657958707580;

```

-----

## TESTING YOUR IMPLEMENTATION • APCA 0.1.1 G-4g

If you've implemented the code and want a quick sanity check,
Here are four keystone checks with no rounding, where the
first color is TEXT and the second color is BACKGROUND.

Each pair of colors is there twice, so you can just swop 
the pair to check polarity. And obviously rounding is
turned off for this check, however for production
you may round to a signed integer. 

    TEXT vs BKGND •  EXPECTED RESULT for 0.1.1 G-4g
    
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
