import * as React from "react";
import './HexagramText.css';

export interface HexagramTextState {
    text: string | null;
}

export default class HexagramText extends React.Component<{}, HexagramTextState> {
    constructor(unit: {}) {
        super(unit);
        this.state = { text: null };
    }

    public setText(text: string) {
        this.setState({ text: text });
    }

    render() {
        let t = this.state.text;
        if (t === null)
            return (<div className="HexagramTextPlaceholder">
                点击查看卦辞爻辞<br /><br />
                本站界面参考：<a href="https://gitee.com/foxnes/zy-mhys">zy-mhys (luuljh)</a><br />
                卦名卦辞参考：<a href="https://www.nuget.org/profiles/YiJingFramework">YiJingFramework</a>
            </div>);
        else
            return (<div className="HexagramText">{this.state.text}</div>);
    }
}
