import * as React from "react";
import './Footer.css';

export default class Footer extends React.Component<{}> {
    constructor(unit: {}) {
        super(unit);
    }

    render() {
        return (
            <div className="footer">
                <p>在Github开源：<a href="https://github.com/yueyinqiu/plum-blossom-numerology.git">plum-blossom-numerology</a></p>
                <p>讨论QQ群：<a href="https://qm.qq.com/cgi-bin/qm/qr?k=DurSB9KwTRtT51GY7p4h3dBLNAtbEmLs&jump_from=webapi">698263999</a></p>
            </div>
        );
    }
}
