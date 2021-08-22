import * as React from "react";
import ActionBar, { ActionBarState } from "./ActionBar";
import { Lunar } from 'lunar-typescript';
import Clear from "./Clear";
import Hexagram from "./Hexagram";
import './Main.css';
import Taichi from './Taichi';
import HexagramText from './HexagramText';

const oneHour = 3600000;

export default class Main extends React.Component {
    private insertWithTime(withTime: boolean): ActionBarState {
        let date = new Date();
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
    private showText(text: string): void {
        this.textRef.current?.setText(text);
    }

    private changeHexagrams(states: ActionBarState) {
        this.taichiRef.current?.rotate();

        let upper = 8 - (states.upperValue % 8 + 8) % 8;
        if (upper === 8)
            upper = 0;
        let lower = 8 - (states.lowerValue % 8 + 8) % 8;
        if (lower === 8)
            lower = 0;
        // 经过如此转换，需自最小位为上看，如
        // 兑：6 - 110

        let original = (lower << 3) + upper;

        let changing = 6 - (states.changingValue % 6 + 6) % 6;
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

        this.originalRef.current?.setHexagram(original);
        this.interRef.current?.setHexagram(inter);
        this.changedRef.current?.setHexagram(changed);
    }

    taichiRef = React.createRef<Taichi>();
    textRef = React.createRef<HexagramText>();
    originalRef = React.createRef<Hexagram>();
    interRef = React.createRef<Hexagram>();
    changedRef = React.createRef<Hexagram>();

    render() {
        let stf = this.showText.bind(this);
        return (
            <div className="Main">
                <Taichi ref={this.taichiRef}></Taichi>
                <ActionBar insertFunction={this.insertWithTime.bind(this)} submitFunction={this.changeHexagrams.bind(this)}></ActionBar>
                <div className="Hexagrams">
                    <Clear></Clear>
                    <Hexagram ref={this.originalRef} showTextFunction={stf} defaultName="点击"></Hexagram>
                    <Hexagram ref={this.interRef} showTextFunction={stf} defaultName={"\"走你\""}></Hexagram>
                    <Hexagram ref={this.changedRef} showTextFunction={stf} defaultName="得卦"></Hexagram>
                    <Clear></Clear>
                </div>
                <HexagramText ref={this.textRef}></HexagramText>
            </div>
        );
    }
}