import React from 'react';
import Image from './Taichi.svg';
import './Taichi.css';


export interface TaichiState {
    rotateState: boolean;
}
class Taichi extends React.Component<{},TaichiState> {
    constructor(unit: {}) {
        super(unit);
        this.state = {rotateState: true};
    }
    rotate() {
        this.setState({rotateState: !this.state.rotateState});
    }
    render() {
        let style = {transform: this.state.rotateState ? 'rotate(65deg)' : 'rotate(965deg)'};
        return (
            <div className="Taichi">
                <img src={Image} alt="taichi" style={style} onMouseDown={(e) => { e.preventDefault() }} />
            </div>
        );
    }
}

export default Taichi;
