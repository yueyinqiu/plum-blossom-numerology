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

    lastUpper: number | null = null;
    lastLower: number | null = null;
    lastChanging: number | null = null;
    private changeHexagrams(states: ActionBarState) {
        let statesUpper = states.upperValue;
        let statesLower = states.lowerValue;
        let statesChanging = states.changingValue;

        if (this.lastUpper === statesUpper &&
            this.lastLower === statesLower &&
            this.lastChanging === statesChanging)
            return;

        this.lastUpper = statesUpper;
        this.lastLower = statesLower;
        this.lastChanging = statesChanging;

        let upper = 8 - (statesUpper % 8 + 8) % 8;
        if (upper === 8)
            upper = 0;
        let lower = 8 - (statesLower % 8 + 8) % 8;
        if (lower === 8)
            lower = 0;
        // 经过如此转换，需自最小位为上看，如
        // 兑：6 - 110

        let original = (lower << 3) + upper;

        let changing = 6 - (statesChanging % 6 + 6) % 6;
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

        setTimeout(() => {
            this.taichiRef.current?.rotate();
            this.originalRef.current?.setHexagram(null);
            this.interRef.current?.setHexagram(null);
            this.changedRef.current?.setHexagram(null);
            this.textRef.current?.setText(null);
        });

        setTimeout(() => {
            this.originalRef.current?.setHexagram(original);
            this.interRef.current?.setHexagram(inter);
            this.changedRef.current?.setHexagram(changed);
        }, 600);
    }

    taichiRef = React.createRef<Taichi>();
    textRef = React.createRef<HexagramText>();
    actionBarRef = React.createRef<ActionBar>();
    originalRef = React.createRef<Hexagram>();
    interRef = React.createRef<Hexagram>();
    changedRef = React.createRef<Hexagram>();

    render() {
        let stf = this.showText.bind(this);
        return (
            <div className="Main">
                <Taichi ref={this.taichiRef}></Taichi>
                <ActionBar ref={this.actionBarRef} insertFunction={this.insertWithTime.bind(this)} submitFunction={this.changeHexagrams.bind(this)}></ActionBar>
                <div className="Hexagrams">
                    <Clear></Clear>
                    <Hexagram ref={this.originalRef} showTextFunction={stf} defaultName="本"></Hexagram>
                    <Hexagram ref={this.interRef} showTextFunction={stf} defaultName="互"></Hexagram>
                    <Hexagram ref={this.changedRef} showTextFunction={stf} defaultName="变"></Hexagram>
                    <Clear></Clear>
                </div>
                <HexagramText ref={this.textRef}></HexagramText>
            </div>
        );
    }

    componentDidMountForTheFirstTime = false;
    async componentDidMount() {
        if (!this.componentDidMountForTheFirstTime) {
            this.componentDidMountForTheFirstTime = true;
            this.actionBarRef.current?.performSubmit();
        }
    }
}