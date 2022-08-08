# APCA-W3 Current Functions & Abstractions 

## Ys SCREEN LUMINANCE abstraction
The estimated relative screen luminance, where Ys 1.0 relates to code value `#ffffff` The abstraction differs slightly from "standard" luminance Y in that it is intended to align with the SAPC standardized observer which is intended to better reflect modern devices and common use environments. BUT ALSO, to provide opportunities to add compensations for certain impairment issues, such as protanopia compensation. 

Ys then is intended to be agnostic of the originating color space. For readability, only the achromatic luminance channel is of significant utility for determining contrast.

### Functions
sRGBtoY(), displayP3toY(), adobeRGBtoY()     
Values sent to these functions must be simple arrays of the RGB tuples [255,255,255]

```js
    txtYs = sRGBtoY(<rgbArrayText>);
    bgYs  = sRGBtoY(<rgbArrayBackground>);
```
Note: both text and BG must be in the same color space and use the same `...toY()` function

-----
## Lc CONTRAST of a color pair
Takes the estimated screen luminance of the text and the BG and generates a polarity sensitive perceptual "lightness contrast" value, L<sup>c</sup>. The value is intended to be perceptually uniform relative to the minimum spatial frequency discernible at the given L<sup>c</sup> value. That is, L<sup>c</sup> is the contrast of high spatial frequency stimuli, and considering polarity, which is notably different than that of relatively large, detail-less patches of color such as described by Munsell value.

Additional color inputs for three way, 4-way and 5-way are possible. The base pair method being chosen right now for simplicity, at a modest expense of some accuracy, but weighted toward the "worst common case".

It is conceivable that the three-way extension can and should be added as the proximal field is perhaps the most important additional input to the model.

### Function
```js
    contrastLc = APCAcontrast( txtYs, bgYs );
```
Where txtYs, bgYs are numbers derived from the `...toY()` function


**For the math used for the APCA contrast algorithm, see [APCA-W3-LaTeX.md](./APCA-W3-LaTeX.md)**

-----
## FONT LUT for minimum font weight and size
Takes the Lc contrast, and returns an array of font sizes for weights 100 thru 900.

### Function
```js
    fontArray = fontLookupAPCA( contrastLc );
```
The first element in the array is the Lc value sent to the function, rounded to two places by default (but settable via the second parameter).

```js
    [Lc,100,200,300,400,500,600,700,800,900]
```
Thus Lc 60 returns

```js
    [60,72,48,42,24,21,18,16,16,18] 
```

### Implementation notes
This follows the "Silver" basic lookup table. In development is a lookup table set that considers the use case of the text (probably sent as a parameter), and indicates maximum contrast limits, and also non-text recommendations.

-----
## REVERSE APCA to find a color @ Lc contrast
Takes the estimated screen luminance of the background (or text) and a target Lc value, and returns either a color or a target Ys value, or error (if the target contrast can not be met).

The basic version is reverseAPCA() which takes at a minimum a target contrast value, and returns an achromatic grey text color as hex (default background is `#fff`). Returns false on any error, including returns false if a suitable color can not be found.

**_Parameter defaults:_**    
` reverseAPCA (contrast = 0, knownY = 1.0, knownType = 'bg', returnAs = 'hex') `

### Function
```js
    textColor = reverseAPCA( 60, bgYs );
```

### Valid values:

- contrast: 9 to 106 or -9 to -108 (values between -9 and 9 return false)
- knownY: the Ys of the known color, can be any value 0.0 to 1.06
- knownType: default is the background color ('bg' or 'background')
    - if the known color is the text, then ('txt' or 'text') to determine the BG,
- returnAs: default returns a CSS color as a hex string, ('hex')
    - Alternately, ('' or '') returns a simple array [colorB,colorB,colorB,1,retUse]
    - And, ('Y' or 'y') returns the target Ys for the desired Lc contrast

### Implementation notes
reverseAPCA() is intended as the simplest way to find a color of a given contrast, but does lack some automated features and returns false if a color that fits does not exist, and the color returned is always an achromatic grey.

A future version, inverseAPCA() adds more automation and better error handling, including returning white or black as a "best compromise" color, and also returning colors with chroma and hue added.

-----
# NON APCA COLOR UTILITIES

## RGBA tuples abstraction
The Color Parsley library is used to convert any RGBA color value (as string, number, or object) to a simple array of RGBA tuples [255,255,255,1]

### Function
```js
    rgbArray = colorParsley(<CSScolor>);
```
Where CSScolor is any valid color string, or number, or object/array

-----
## RGBA text transparency
The alphaBlend helper function determines the resultant color of transparent text against a solid background.
### Function
```js
    rgbTextArray = alphaBlend(<rgbArrayTextWithAlpha>, <rgbArrayBackground>);
```
Where rgbArray is an array created by colorParsley()




