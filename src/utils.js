import { APCAcontrast, sRGBtoY } from "apca-w3";
import { colorParsley } from "colorparsley";

const shouldUseDarkText = (color, darkText = "black", lightText = "white") => {
    const testColor = colorParsley(color)
    return Math.abs(APCAcontrast(sRGBtoY(colorParsley(darkText)), sRGBtoY(testColor))) >= Math.abs(APCAcontrast(sRGBtoY(colorParsley(lightText)), sRGBtoY(testColor)))
}

export { shouldUseDarkText }
