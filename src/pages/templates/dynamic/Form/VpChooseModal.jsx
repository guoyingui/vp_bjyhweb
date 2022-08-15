import React from 'react';
import {
	VpModal,
	VpFInput,
	VpIcon,
	VpTooltip,
	VpIconFont
} from 'vpreact';
import { RightBox } from 'vpbusiness';
import { requireFile } from 'utils/utils';
import ChooseEntity from './ChooseEntity';
import DetailForm from '../DynamicForm/detailForm';

export default class VpChooseModal extends React.Component {
	constructor(props) {
		super(props);
		let { style, modalProps, value = "", initialName = "", ...otherProps } = this.props;
		this.modalProps = modalProps || {};
		this.state = {
			value: value,
			name: initialName,
			showModal: false,
			original: [],
			details: '',
			showDetailRightBox:false
			// names: this.props.item.widget ? this.props.item.widget.default_label : '',
		}
		this.okModal = this.okModal.bind(this);
		this.cancelModal = this.cancelModal.bind(this);
		this.detailClick = this.detailClick.bind(this);
	}

	componentWillMount() {
		const { setFieldsValue } = this.props.form;
		const widget = this.props.widget || {};
		if (Object.keys(widget).length && widget.default_value) {
			const value = widget ? widget.default_value : ''
			// setFieldsValue({ [this.state.item.field_name]: value });
			const valueArr = widget.default_value ? widget.default_value.split(',') : [];
			const nameArr = widget.default_label ? widget.default_label.split(',') : [];
			const original = valueArr.map((value, index) => {
				return { iid: value, sname: nameArr[index] }
			})
			original.map((item, index) => {
				item.key = item.iid;
			})
			this.setState({
				original,
				details: original
			})
		}
	}
	//父页面设置处理人调用
	changeState = (userids, usernames) => {
		const valueArr = userids ? userids.split(',') : [];
		const nameArr = usernames ? usernames.split(',') : [];
		const original = valueArr.map((value, index) => {
			return { key: value, iid: value, sname: nameArr[index] }
		})
		this.setState({
			value: userids,
			name: usernames,
			original,
			details: original
		})
		//设置父页面字段值，并调用onchange方法
		const { setFieldsValue } = this.props.form;
		setFieldsValue({ [this.props.field_name + "_label"]: usernames });
		this.triggerChange(userids);
	}
	getValueAndNames = () => {
		//解析,将分散的value、name合成valueAndNames，方便传入modal中
		let values = this.state.value;
		let valueAndNames = []; //保存名称和值
		if (!(values instanceof Array)) {
			values = values ? values.split(",") : [];
		}
		if (values.length > 0) {
			let names = this.state.name;
			if (!(names instanceof Array)) {
				names = names ? names.split(",") : [];
			}
			valueAndNames = values.map(function (item, index) {
				return {
					iid: item, sname: names[index]
				}
			})
		}
		return valueAndNames;
	}

	triggerChange = (changedValue,name) => {
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(changedValue,name);
		}
	}

	detailClick = () => {
		let item = this.props;
		//let widget = item.widget_type
		//let irelationentityid = item.irelationentityid
		this.setState({
			widgetDetail: item, //控件的详细信息
			chosenList: this.state.details,//选中的记录
			showDetailRightBox: true
		})
	}
	//销毁详情dom
	destoryDetailDom = () => {
		this.setState({
			showDetailRightBox: false
		})
	}

	opensDetailRightBox = () => {
		this.setState({
			showDetailRightBox: true
		})
	}

	showModal = (o) => {
		//点击弹出窗时，实时获取该选择模态窗组件的值。避免组件加载成功后，二次开发重新赋值，点开弹出窗却没有显示赋的值。
		let name=this.props.form.getFieldValue&&this.props.form.getFieldValue(this.props.field_name+'_label');
		let value=this.props.form.getFieldValue&&this.props.form.getFieldValue(this.props.field_name);
		if (!this.props.disabled) {
			this.setState({ showModal: true,name,value });
			this.modalProps.onShow && this.modalProps.onShow();
		}
	}
	okModal = (valueAndNames) => {
		this.hideModal();
		valueAndNames = valueAndNames ? valueAndNames : [];
		let values = [];
		let names = [];
		valueAndNames.forEach(function (item, index) {
			values.push(item.iid);
			names.push(item.sname);
		});
		let name = names.join(",");

		const { setFieldsValue } = this.props.form;
		setFieldsValue({ [this.props.field_name + "_label"]: name });
		const original = values.map((value, index) => {
			return { key: value, iid: value, sname: names[index] }
		})
		this.setState({
			value: values.join(","),
			name: name,
			original,
			details: original
		});
		this.triggerChange(values.join(","),name);
	}
	cancelModal = () => {
		this.hideModal();
	}
	hideModal = () => {
		this.setState({ showModal: false });
		this.modalProps.onHide && this.modalProps.onHide();
	}

	render() {
		let ModalContent = requireFile(this.modalProps.url) || ChooseEntity;
		const { getFieldProps } = this.props.form;
		let labelFieldProps = getFieldProps(this.props.field_name + "_label", {
			initialValue: this.props.initialName,
			rules: this.props["data-__meta"].rules
		});
		return (
			<div className="modal" >
				<VpFInput
					{...labelFieldProps}
					className="cursor"
					readOnly={true}
					label={this.props.label}
					placeholder={this.props.placeholder}
					labelCol={this.props.labelCol}
					wrapperCol={this.props.wrapperCol}
					onClick={this.showModal}
					//value={this.state.name}
					suffix={
						this.props.irelationentityid && this.props.irelationentityid > 0 && this.state.value != null && this.state.value.length > 0 ?
							// 屏蔽小灯泡
							// <VpTooltip title="查看详情">
							// 	<VpIconFont type='vpicon-tip' onClick={this.detailClick} style={{ marginTop: 7 }} />
							// </VpTooltip>
							<VpIcon type='search' style={{ marginTop: 7 }} />
							:
							<VpIcon type='search' style={{ marginTop: 7 }} />
					}
				/>
				<VpModal
					title={this.props.label}
					visible={this.state.showModal}
					onOk={this.okModal}
					onCancel={this.cancelModal}
					width={'70%'}
					wrapClassName='modal-no-footer dynamic-modal'
					footer={null}
				>
					{
						this.state.showModal ? <ModalContent
							item={this.props}
							visible={this.state.showModal}
							onOk={this.okModal}
							onCancel={this.cancelModal}
							initValue={this.getValueAndNames()} /> : null
					}
				</VpModal>
				{this.state.showDetailRightBox ?

					<RightBox
						max={false}
						button={
							<div className="icon p-xs" onClick={() => this.destoryDetailDom()}>
								<VpTooltip placement="top" title=''>
									<VpIcon type="right" />
								</VpTooltip>
							</div>}
						show={this.state.showDetailRightBox}>
						{
							this.state.showDetailRightBox ?
								<DetailForm
									widgetDetail={this.state.widgetDetail}
									chosenList={this.state.chosenList}
									opensDetailRightBox={() => this.opensDetailRightBox()}
									showDetailRightBox={this.state.showDetailRightBox}
									destoryDetailDom={() => this.destoryDetailDom()}
								/>
								:
								''
						}
					</RightBox> : null
				}
			</div>
		)
	}
}