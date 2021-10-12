import React from 'react';
import Image from './Taichi.svg';
import './Taichi.css';


export interface TaichiState {
    rotateState: number;
}
export default class Taichi extends React.Component<{}, TaichiState> {
    constructor(unit: {}) {
        super(unit);
        this.state = { rotateState: 67 };
    }
    rotate() {
        let rand = Math.random();
        console.log(rand);
        this.setState({ rotateState: this.state.rotateState + (rand < 0.5 ? -720 : 720) });
    }

    render() {
        let style = { transform: `rotate(${this.state.rotateState}deg)` };
        return (
            <div className="Taichi">
                <img src={Image} alt="taichi" style={style} onMouseDown={(e) => { e.preventDefault() }} />
            </div>
        );
    }
}