import React, { Component } from 'react'
import {
    VpFormCreate
} from 'vpreact';
import {
    SeachInput,
    RightBox,
} from 'vpbusiness';
import {requireFile} from "utils/utils";

const RelEntity = requireFile('vfm/dynamic/RelEntity/relEntity');

//分配资源
class relationList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            entityid: '',
            iid: '',
            skey: '',
			entityrole:false
        }

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.stabparam != this.props.stabparam){
			let skey = nextProps.skey
           skey = skey.replace(/[^0-9]/ig, "")//权限码中提取数字，数字即为当前挂起的实体id
            this.setState({
                stabparam:nextProps.stabparam,
				skey:skey,
				entityrole:nextProps.entityrole
            })
        }
    }
    componentWillMount() {
        let skey = this.props.skey
        skey = skey.replace(/[^0-9]/ig, "")//权限码中提取数字，数字即为当前挂起的实体id
        let entityid = this.props.viewtype == 'pjtree' ? this.props.row_entityid : this.props.entityid
        let iid = this.props.viewtype == 'pjtree' ? this.props.row_id : this.props.iid
        let stabparam = this.props.stabparam
		let entityrole = this.props.entityrole
        this.setState({
            entityid, iid, skey, stabparam,entityrole
        })
    }
    componentDidMount() {
    }

    render() {
        let _this = this
        return (
            <RelEntity
                entityid={_this.state.entityid}
                iid={_this.state.iid}
                imainentity={_this.state.entityid}
                irelationentity={_this.state.skey}
                row_entityid={_this.state.entityid}
                row_id={_this.state.iid}
                issubitem={_this.props.issubitem}
                stabparam={_this.state.stabparam}
                entityrole = {_this.state.entityrole}
                skey = {_this.state.skey}//权限吗码
                //setBreadCrumb = {(sname)=>this.props.setBreadCrumb(sname)}
                isTab={'true'}
                viewtype={'list'}
            />
        );
    }
}


export default relationList = VpFormCreate(relationList);