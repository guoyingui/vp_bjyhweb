import React, { Component } from "react";
import { VpIconFont } from "vpreact";

export default class Demo extends Component {
    render() {
        return (
            <div style={{textAlign:'center',padding:'15%'}}>
                <VpIconFont type="vpicon-hand" className="text-primary m-b-sm" style={{fontSize:'64px'}}/>
                <div className="f18">工程已启动成功，请开始你的编码~~</div>
            </div>
        )
    }
}