import * as React from "react";
import './ActionBar.css';
import {YiNumbers} from "../tools/YiCalculator"

export interface InsertAllFunction {
    (withTime: boolean): YiNumbers;
}

export interface InsertLineFunction {
    (numbers: YiNumbers): YiNumbers;
}

export interface ShareFunction {
    (): YiNumbers;
}

export interface SubmitFunction {
    (numbers: YiNumbers, withAnimation: boolean): void;
}

export interface ActionBarProperties {
    submitFunction: SubmitFunction;
    insertAllFunction: InsertAllFunction;
    insertLineFunction: InsertLineFunction;
    shareFunction: ShareFunction;
}

interface ActionBarState {
    upperValue: number;
    lowerValue: number;
    changingValue: number;
}

export default class ActionBar extends React.Component<ActionBarProperties, ActionBarState> {
    constructor(properties: ActionBarProperties) {
        super(properties);
        this.state = this.props.insertAllFunction(false);
    }

    upperRef = React.createRef<HTMLInputElement>();
    lowerRef = React.createRef<HTMLInputElement>();
    changingRef = React.createRef<HTMLInputElement>();

    changeValues(states: YiNumbers) {
        this.setState(states);
    }

    onValueChanged(upper: number, lower: number, changing: number) {
        this.setState(
            {
                upperValue: upper,
                lowerValue: lower,
                changingValue: changing
            });
    }
    render() {
        return (
            <form>
                <div className="ActionBar">
                    <div>
                        <input type="number" ref={this.upperRef}
                            placeholder="上卦" value={this.state.upperValue}
                            onChange={(e) => this.onValueChanged(e.target.valueAsNumber, this.state.lowerValue, this.state.changingValue)} />
                        <input type="number" ref={this.lowerRef}
                            placeholder="下卦" value={this.state.lowerValue}
                            onChange={(e) => this.onValueChanged(this.state.upperValue, e.target.valueAsNumber, this.state.changingValue)} />
                        <input type="number" ref={this.changingRef}
                            placeholder="爻动" value={this.state.changingValue}
                            onChange={(e) => this.onValueChanged(this.state.upperValue, this.state.lowerValue, e.target.valueAsNumber)} />
                        <button type="button" onClick={() => { this.performSubmit(true); }}>走你</button>
                    </div>
                    <div>
                        <button type="button" onClick={() =>
                            this.changeValues(this.props.insertAllFunction(true))}>以时填卦</button>
                        <button type="button" onClick={() =>
                            this.insertLine()}>加时填爻</button>
                        <button type="button" onClick={() =>
                            this.changeValues(this.props.shareFunction())}>分享</button>
                    </div>
                </div>
            </form>
        );
    }

    insertLine()
    {
        let upper = this.upperRef.current?.valueAsNumber;
        let lower = this.lowerRef.current?.valueAsNumber;
        if (upper === undefined || isNaN(upper))
            upper = 1;
        if (lower === undefined || isNaN(lower))
            lower = 1;
        let s = {
            upperValue: upper,
            lowerValue: lower,
            changingValue: 0
        };
        this.changeValues(this.props.insertLineFunction(s));
    }

    performSubmit(withAnimation: boolean) {
        let upper = this.upperRef.current?.valueAsNumber;
        let lower = this.lowerRef.current?.valueAsNumber;
        let changing = this.changingRef.current?.valueAsNumber;
        if (upper === undefined || isNaN(upper))
            upper = 1;
        if (lower === undefined || isNaN(lower))
            lower = 1;
        if (changing === undefined || isNaN(changing))
            changing = 1;
        let s = {
            upperValue: upper,
            lowerValue: lower,
            changingValue: changing
        };
        this.props.submitFunction(s, withAnimation);
        this.changeValues(s);
    }
}
