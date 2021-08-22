import * as React from "react";
import './Hexagram.css';
import YiHexagram from "./../tools/YiHexagram";

export interface ShowTextFunction {
    (text: string): void;
}

export interface HexagramProperties {
    showTextFunction: ShowTextFunction;
}
export interface HexagramState {
    hexagramNumber: number | null;
}

export default class Hexagram extends React.Component<HexagramProperties, HexagramState> {
    constructor(properties: HexagramProperties) {
        super(properties);
        this.state = { hexagramNumber: null };
    }

    public setHexagram(hexagramNumber: number) {
        this.setState({ hexagramNumber });
    }

    render() {
        let number = this.state.hexagramNumber;
        if (number === null) {
            return (
                <div className="Hexagram">
                    <div className="HexagramName">༺卦༻</div>
                    <div className="Trigram">
                        <div className="YangLine"></div>
                        <div className="br"></div>
                        <div className="YangLine"></div>
                        <div className="br"></div>
                        <div className="YangLine"></div>
                        <div className="br"></div>
                    </div>
                    <div className="Trigram">
                        <div className="YangLine"></div>
                        <div className="br"></div>
                        <div className="YangLine"></div>
                        <div className="br"></div>
                        <div className="YangLine"></div>
                        <div className="br"></div>
                    </div>
                </div>
            );
        }

        let hexagramInfo = new YiHexagram(number);
        let lines = hexagramInfo.split();

        return (
            <div className="Hexagram" onClick={
                () => { this.props.showTextFunction(hexagramInfo.getText()) }
            }>
                <div className="HexagramName">༺{hexagramInfo.getName()}༻</div>
                <div className="Trigram" style={{
                    backgroundColor: hexagramInfo.getUpperFiveElementsColor()
                }}>
                    <div className={lines[5] === 0 ? "YinLine" : "YangLine"}></div>
                    <div className="br"></div>
                    <div className={lines[4] === 0 ? "YinLine" : "YangLine"}></div>
                    <div className="br"></div>
                    <div className={lines[3] === 0 ? "YinLine" : "YangLine"}></div>
                    <div className="br"></div>
                </div>
                <div className="Trigram" style={{
                    backgroundColor: hexagramInfo.getLowerFiveElementsColor()
                }}>
                    <div className={lines[2] === 0 ? "YinLine" : "YangLine"}></div>
                    <div className="br"></div>
                    <div className={lines[1] === 0 ? "YinLine" : "YangLine"}></div>
                    <div className="br"></div>
                    <div className={lines[0] === 0 ? "YinLine" : "YangLine"}></div>
                    <div className="br"></div>
                </div>
            </div>
        );
    }
}
