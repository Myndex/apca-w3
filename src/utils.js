import { APCAcontrast, sRGBtoY } from "apca-w3";
import { colorParsley } from "colorparsley";

const shouldUseDarkText = (color) => {
    const testColor = colorParsley(color)
    return Math.abs(APCAcontrast(sRGBtoY(colorParsley("black")), sRGBtoY(testColor))) >= Math.abs(APCAcontrast(sRGBtoY(colorParsley("white")), sRGBtoY(testColor)))
}

export { shouldUseDarkText }
