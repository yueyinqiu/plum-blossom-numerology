import * as Cookies from 'es-cookie';
import { YiNumbers } from "./YiCalculator";

const upper = "pbnUpper";
const lower = "pbnLower";
const changing = "pbnChanging";
// const time = "pbnTime";
const bool = "pbnBool";
export default class CookieManager {
    saveNumbers(numbers: YiNumbers) {
        Cookies.set(upper, numbers.upperValue.toString());
        Cookies.set(lower, numbers.lowerValue.toString());
        Cookies.set(changing, numbers.changingValue.toString());
    }
    getNumbers(): YiNumbers | null {
        let upperValue = Cookies.get(upper);
        let lowerValue = Cookies.get(lower);
        let changingValue = Cookies.get(changing);
        if (upperValue === undefined || lowerValue === undefined || changingValue === undefined)
            return null;
        return {
            upperValue: Number.parseInt(upperValue),
            lowerValue: Number.parseInt(lowerValue),
            changingValue: Number.parseInt(changingValue)
        }
    }
    /*
    saveTime(index: string, date:Date) {
        Cookies.set(time + index, date.getTime().toString());
    }
    getSavedTime(index: string): Date | null {
        let t = Cookies.get(time + index);
        if (t === undefined)
            return null;
        return new Date(t);
    }
    */

    
    saveBoolean(index: string, value: boolean) {
        Cookies.set(bool + index, value ? "t" : "f");
    }
    getBoolean(index: string): boolean | null {
        let t = Cookies.get(bool + index);
        if (t === "t")
            return true;
        if (t === "f")
            return false;
        return null;
    }
}
