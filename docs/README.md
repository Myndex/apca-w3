# APCA W3 JS Library Documentation
### Updated Dec 1, 2021 for 0.98G-4g W3 npm release

This is a set of JS functions/objects to determine a contrast value for a color pair, using the SAPC/APCA methods. 

These are based on research iteration SAPC-8, developed through a lengthy series of experiments and investigations. They all have a soft black clamp for the darker color, and a basic set of constants for the power curve exponents to predict an estimated perceptual contrast under common use case environments. These are active beta and are receiving updates and changes regularly.

-----

## apca-w3-v.0.0.98g-4g.min.js — SIMPLE QUICK START
This APCA version is the version licensed to the W3/AGWG for use with web content accessibility standards, WCAG 3.

If you want to dive in fast, or you want the bare basics, this is the file for you. This only comes with the most basic color input parsing, and does not containt the automated lookup tables or advanced CIE processing. It is the base APCA algorithim only, with no bells or whistles. Send it two RGB numeric colors and it returns a numeric L<sup>c</sup> contrast value.

### QuickStart

```javascript
    import { APCAcontrast, sRGBtoY } from 'apca-w3';
```
***Usage:***

First color must be text, second color must be the background.
```javascript
    let contrastLc = APCAcontrast( sRGBtoY( textColor ), sRGBtoY( backgroundColor ) );
```
The following are the available input types for sRGBtoY(), HSL is not implemented at the moment. All are automatically recognized:

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


The sRGBtoY() function takes two sRGB encoded colors, where each color is one of:
- integer in RGB order, (i.e. 0xRRGGBB or 16777216).
- a hex string such as #fff or aabbcc (hash # is not required)
- a CSS named color such as 'aliceblue' or 'magenta'
- as rgb(123,123,123)
and then returns luminance (Y)

The APCAcontrast() function takes the text and background luminance.

### API
The API for "APCA_0_98G_4g_minimal" is trivially simple. Send text and background sRGB numeric values to the sRGBtoY() function, and send the resulting text-Y and background-Y to the APCAcontrast function, it returns a signed float of the numeric L<sup>c</sup> contrast result.

The two inputs are TEXT color and BACKGROUND color in that order. Each must be a numeric NOT a string, as this simple version has no string parsing utilities. 
### EXAMPLE:
```js
     txtColor = 'darkslategrey'; // named color of the text, which is 2f4f4f
     bgColor  = 0xabcdef; // numeric color for the background, as will be rendered

     contrastLc = APCAcontrast( sRGBtoY(txtColor) , sRGBtoY(bgColor) );
```
Each color must be a 24bit color (8 bit per channel) as a single integer (or 0x) sRGB encoded color, i.e. White is either the integer 16777216 or the hex 0xffffff. A signed int is returned with a positive or negative value. Negative values mean light text and a dark background, positive values mean dark text and a light background. 60.0, or -60.0 is a contrast "sort of like" the old WCAG 2's 4.5:1. NOTE: the total range is now less than ± 110, so output can be rounded to a signed INT but DO NOT output an absolute value - **light text on dark BG should return a negative number**.

### IMPORTANT: Do Not Mix Up Text and Background inputs.
**APCA is polarity dependent, and correct results require that the TXT and BG are processed via the correct inputs.**

**PARAMETER CHANGE for 0.98G:** The order in parameters is APCAcontrast(text,background) — THIS IS THE REVERSE OF SOME EARLIER VERSIONS. This is because there will be additional background colors in a near future version, such as` APCAcontrast(text, BGlocal, BGsurround, BGpage...) ` and the intention is to follow visible layer order, as a stack from top to bottom.

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

### Font Use Lookup Table
Latest Lookup Table: November 17 2021

<img width="639" alt="0.0.98G4gLUT" src="../images/0.0.98G4gLUT.png">

<img width="596" alt="0.0.98G4gLUT legend" src="../images/0.0.98G4gLUT-legenf.png">

```javascript
// APCA FONT LOOKUP TABLE 0.98G-4g-b3
// Font Size and Reference Font Weight

const fontLUT = [
[pt,px,100,200,300,400,500,600,700,800,900],
[7.5,10,'⊘','⊘','⊘','©§™ 60','©§™ 60','©§™ 60','©§™ 60','⊘','⊘'],
[7.88,10.5,'⊘','⊘','⊘','©§™ 60','©§™ 60','©§™ 60','©§™ 60','⊘','⊘'],
[8.25,11,'⊘','⊘','⊘','©§™ 60','©§™ 60','©§™ 60','©§™ 60','⊘','⊘'],
[9,12,'⊘','⊘','©§™ 75','× 90','× 85','× 80','× 75','⊘','⊘'],
[10.5,14,'⊘','⊘','©§™ 75',90,85,80,75,'⊘','⊘'],
[12,16,'⊘','©§™ 75','©§™ 75',75,70,65,60,'× 55','⊘'],
[13.5,18,'⊘','©§™ 75',90,70,65,60,55,'× 50','× 45'],
[15.8,21,'⊘','©§™ 75',85,65,60,55,50,'× 45','× 40'],
[18,24,'⊘',90,75,60,55,50,45,'× 40','× 35'],
[24,32,'⊘',85,70,55,50,45,40,35,30],
[31.5,42,90,75,60,50,45,40,35,30,30],
[42,56,85,70,55,45,40,35,30,30,30],
[54,72,75,60,50,40,35,30,30,30,30],
[72,96,70,55,45,35,30,30,30,30,30],
[96,128,60,45,40,30,30,30,30,30,30]
];
```

-----
Please let us know of any problems, ideas, comments, etc. in the discussion tab at the github repo.

Thank you!

_Andrew Somers     
(User Myndex)_

You can see the current working version at https://www.myndex.com/APCA/

There is more about this project on our main site, https://www.myndex.com/WEB/Perception
