import * as React from "react";
import ActionBar from "./ActionBar";
import YiCalculator, { YiNumbers } from "../tools/YiCalculator";
import CookieManager from "../tools/CookieManager";
import Clear from "./Clear";
import Hexagram from "./Hexagram";
import './Main.css';
import Taichi from './Taichi';
import HexagramText from './HexagramText';

export default class Main extends React.Component<{}> {
    yiCalculator = new YiCalculator();
    cookieManager = new CookieManager();

    constructor() {
        super({});
        this.checkAndRedirect();
    }

    private insertAll(withTime: boolean): YiNumbers {
        if (withTime)
            return this.yiCalculator.getYiNumbersByTime(new Date());

        let numbers = this.cookieManager.getNumbers();
        if (numbers === null)
            return this.yiCalculator.getYiNumbersByTime(new Date());
        else
            return numbers;
    }

    private insertLine(yiNumbers: YiNumbers): YiNumbers {
        return this.yiCalculator.getYiNumberWithTimeAddedLine(yiNumbers, new Date());
    }

    private showText(text: string): void {
        this.textRef.current?.setText(text);
    }

    lastUpper: number | null = null;
    lastLower: number | null = null;
    lastChanging: number | null = null;
    private changeHexagrams(yiNumbers: YiNumbers, withAnimation: boolean) {
        if (this.lastUpper === yiNumbers.upperValue &&
            this.lastLower === yiNumbers.lowerValue &&
            this.lastChanging === yiNumbers.changingValue)
            return;

        this.lastUpper = yiNumbers.upperValue;
        this.lastLower = yiNumbers.lowerValue;
        this.lastChanging = yiNumbers.changingValue;
        this.cookieManager.saveNumbers(yiNumbers);

        let hexagrams = this.yiCalculator.getHexagramNumbersByYiNumbers(yiNumbers);

        if (withAnimation) {
            setTimeout(() => {
                this.taichiRef.current?.rotate();
                this.originalRef.current?.setHexagram(null);
                this.interRef.current?.setHexagram(null);
                this.changedRef.current?.setHexagram(null);
                this.textRef.current?.setText(null);
            });

            setTimeout(() => {
                this.originalRef.current?.setHexagram(hexagrams.original);
                this.interRef.current?.setHexagram(hexagrams.inter);
                this.changedRef.current?.setHexagram(hexagrams.changed);
            }, 600);
        }
        else {
            this.originalRef.current?.setHexagram(hexagrams.original);
            this.interRef.current?.setHexagram(hexagrams.inter);
            this.changedRef.current?.setHexagram(hexagrams.changed);
        }
    }

    taichiRef = React.createRef<Taichi>();
    textRef = React.createRef<HexagramText>();
    actionBarRef = React.createRef<ActionBar>();
    originalRef = React.createRef<Hexagram>();
    interRef = React.createRef<Hexagram>();
    changedRef = React.createRef<Hexagram>();

    private share(): YiNumbers {
        let url = new URL(window.location.href);
        url.search = "";
        let params = url.searchParams;
        params.append("u", (this.lastUpper as number)?.toString());
        params.append("l", (this.lastLower as number)?.toString());
        params.append("c", (this.lastChanging as number)?.toString());
        this.textRef.current?.setText(`复制以分享：${url.href}`);
        return {
            upperValue: this.lastUpper as number,
            lowerValue: this.lastLower as number,
            changingValue: this.lastChanging as number
        }
    }

    willBeRedirected = false;
    checkAndRedirect() {
        let url = new URL(window.location.href);

        let u = url.searchParams.get("u");
        if (u === null)
            return;
        let l = url.searchParams.get("l");
        if (l === null)
            return;
        let c = url.searchParams.get("c");
        if (c === null)
            return;

        this.cookieManager.saveNumbers({
            upperValue: Number.parseInt(u),
            lowerValue: Number.parseInt(l),
            changingValue: Number.parseInt(c)
        });
        this.cookieManager.saveBoolean("fromShared", true);

        url.search = "";
        window.location.replace(url.href);
        this.willBeRedirected = true;
    }

    render() {
        if (this.willBeRedirected)
            return;
        let stf = this.showText.bind(this);
        return (
            <div className="Main">
                <Taichi ref={this.taichiRef}></Taichi>
                <ActionBar ref={this.actionBarRef} insertAllFunction={this.insertAll.bind(this)} submitFunction={this.changeHexagrams.bind(this)} insertLineFunction={this.insertLine.bind(this)} shareFunction={this.share.bind(this)}></ActionBar>
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
    componentDidMount() {
        if (this.willBeRedirected)
            return;
        if (!this.componentDidMountForTheFirstTime) {
            this.componentDidMountForTheFirstTime = true;

            let fromShared = this.cookieManager.getBoolean("fromShared");

            if (fromShared === null || fromShared) // 以前从未使用过，或者是通过分享链接而来
                this.actionBarRef.current?.performSubmit(true);
            else
                this.actionBarRef.current?.performSubmit(false);

            this.cookieManager.saveBoolean("fromShared", false);
        }
    }
}