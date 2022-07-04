# This subfolder contains data for lookup tables, constants, and other goodies. 

## _INDEX_

- LUT-GseriesJan27-2021.js - these are JS arrays of the current LUTs for font size and weight. Please check here regularly for updates during the public beta period.


### TABLE OF CONTENTS of file LUT-GseriesJan27-2021.js

A) Prepared Javascript Arrays  (line 62)
 1) Index arrays - just 1D prototypes of the Y or X axis
 2) Font Lookup Sorted by font size
 3) Font Lookup Sorted by Contrast Lc
 4) 'MAX' Font Lookup Sorted by Contrast Lc
 5) Use Case Score Adjust array sorted by Contrast Lc
 6) Font Lookup ASCENDING SORT by Contrast, as needed for APCA-W3
    - This includes the font interpolator function from APCA-W3

B) Prepared HTML Visual Tables (line 648)
 1) Font Lookup Sorted by font size
 2) Font Lookup Sorted by Contrast Lc

C) Raw tab-delimited data from the development tool (line 1300)
 1) Font Lookup Sorted by font size
 2) Font Lookup Sorted by Contrast Lc
 3) 'MAX' Font Lookup
 4) Use Case Score Adjust



### INTRODUCTION 

APCA CONTRAST FONT LOOKUP TABLES
Copyright © 2022 by Myndex Research and Andrew Somers. All Rights Reserved

Public Beta 0.1.7 (G) • MAY 28 2022 

* NOTES: These new arrays have a few more elements in them, to 
 facilitate the new multi-use-case conformance concept, wherein 
 different use cases have (essentially) different lookups.

* On the SAPC site, this is demonstrated: the score array provides the
 adjustment factor, applied to the base font lookup table, as needed
 for different use cases.

A few additional elements were added to accommodate a new use-case 
conformance method.

These arrays are in their natural sort order.
The natural sort order then is ascending for font size and weight,
And that then correlates with a descending contrast array.

However, if sorted to ascending, then
    ` Lc 45 * 0.2 = 9 `
  and 9 is the index for the row for Lc 45





