import * as React from "react";
import './Footer.css';

export default class Footer extends React.Component<{}> {
    constructor(unit: {}) {
        super(unit);
    }

    render() {
        return (
            <div className="footer">
                <p>一同学习梅花、想要问卦可加群：<a href="https://qm.qq.com/cgi-bin/qm/qr?k=DurSB9KwTRtT51GY7p4h3dBLNAtbEmLs&jump_from=webapi">698263999</a></p>
                <p>本站参考的项目：<a href="https://gitee.com/foxnes/zy-mhys">zy-mhys (luuljh)</a>、<a href="https://www.nuget.org/profiles/YiJingFramework">YiJingFramework</a>（经部：271895cd-fcbf-4af9-aa94-c81c268a2327、象辞彖辞：fb50430b-c0cd-47a8-9919-15493f2c60b5）</p>
            </div>
        );
    }
}
