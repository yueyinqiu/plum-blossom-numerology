import { Lunar } from 'lunar-typescript';

export interface YiNumbers {
    upperValue: number;
    lowerValue: number;
    changingValue: number;
}
export interface HexagramNumbers {
    original: number;
    changed: number;
    inter: number;
}

const oneHour = 3600000;
export default class YiCalculator {
    getYiNumbersByTime(date: Date): YiNumbers {
        if (date.getHours() === 23)
            date = new Date(date.getTime() + oneHour);
        let lunar = Lunar.fromDate(date);
        let year = lunar.getYearZhiIndex() + 1;
        let month = lunar.getMonth();
        let day = lunar.getDay();
        let time = lunar.getTimeZhiIndex() + 1;
        let upper = year + month + day;
        let lower = upper + time;
        return { upperValue: upper, lowerValue: lower, changingValue: lower };
    }
    getYiNumberWithTimeAddedLine(source: YiNumbers, date: Date): YiNumbers {
        if (date.getHours() === 23)
            date = new Date(date.getTime() + oneHour);
        let lunar = Lunar.fromDate(date);
        let time = lunar.getTimeZhiIndex() + 1;
        return {
            upperValue: source.upperValue,
            lowerValue: source.lowerValue,
            changingValue: source.upperValue + source.lowerValue + time
        };
    }
    getHexagramNumbersByYiNumbers(numbers: YiNumbers): HexagramNumbers {
        let upper = 8 - (numbers.upperValue % 8 + 8) % 8;
        if (upper === 8)
            upper = 0;
        let lower = 8 - (numbers.lowerValue % 8 + 8) % 8;
        if (lower === 8)
            lower = 0;
        // 经过如此转换，需自最小位为上看，如
        // 兑：6 - 110

        let original = (lower << 3) + upper;

        let changing = 6 - (numbers.changingValue % 6 + 6) % 6;
        if (changing === 6)
            changing = 0;
        let changed = original ^ (1 << changing);

        let interFrom = original === 0b000000 || original === 0b111111 ? changed : original;

        interFrom >>= 1;
        let line5 = interFrom & 1;
        interFrom >>= 1;
        let line4 = interFrom & 1;
        interFrom >>= 1;
        let line3 = interFrom & 1;
        interFrom >>= 1;
        let line2 = interFrom & 1;

        let inter = line2;
        inter <<= 1;
        inter += line3;
        inter <<= 1;
        inter += line4;
        inter <<= 1;
        inter += line3;
        inter <<= 1;
        inter += line4;
        inter <<= 1;
        inter += line5;

        return { original: original, changed: changed, inter: inter };
    }
}
