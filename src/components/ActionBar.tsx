import * as React from "react";
import './ActionBar.css';

export interface InsertFunction {
    (withTime: boolean): ActionBarState;
}

export interface SubmitFunction {
    (state: ActionBarState): void;
}

export interface ActionBarProperties {
    submitFunction: SubmitFunction;
    insertFunction: InsertFunction;
}

export interface ActionBarState {
    upperValue: number;
    lowerValue: number;
    changingValue: number;
}

export default class ActionBar extends React.Component<ActionBarProperties, ActionBarState> {
    constructor(properties: ActionBarProperties) {
        super(properties);
        this.state = this.props.insertFunction(false);
    }

    upperRef = React.createRef<HTMLInputElement>();
    lowerRef = React.createRef<HTMLInputElement>();
    changingRef = React.createRef<HTMLInputElement>();

    changeValues(states: ActionBarState) {
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
                    <input type="number" ref={this.upperRef}
                        placeholder="上卦" value={this.state.upperValue}
                        onChange={(e) => this.onValueChanged(e.target.valueAsNumber, this.state.lowerValue, this.state.changingValue)} />
                    <input type="number" ref={this.lowerRef}
                        placeholder="下卦" value={this.state.lowerValue}
                        onChange={(e) => this.onValueChanged(this.state.upperValue, e.target.valueAsNumber, this.state.changingValue)} />
                    <input type="number" ref={this.changingRef}
                        placeholder="爻动" value={this.state.changingValue}
                        onChange={(e) => this.onValueChanged(this.state.upperValue, this.state.lowerValue, e.target.valueAsNumber)} />

                    <button type="button" onClick={() => {
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
                        this.props.submitFunction(s);
                        this.changeValues(s);
                    }}>走你</button>
                    <button type="button" onClick={() =>
                        this.changeValues(this.props.insertFunction(true))}>按时间填入</button>
                </div>
            </form>
        );
    }
}
