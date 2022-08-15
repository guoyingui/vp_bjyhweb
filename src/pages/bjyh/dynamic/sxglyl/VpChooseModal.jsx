import React from 'react';
import {
	VpModal,
	VpFInput,
	VpIcon,
	VpTooltip,
	VpIconFont
} from 'vpreact';
import { requireFile } from 'utils/utils';
import ChooseEntity from './ChooseEntity';

export default class VpChooseModal extends React.Component {
	constructor(props) {
		super(props);
		let { style, modalProps, value = "", initialName = "", ...otherProps } = this.props;
		console.log(value,initialName);
		this.modalProps = modalProps || {};
		this.state = {
			value: value,
			name: initialName,
			showModal: false,
			original: [],
			details: ''
		}
		this.okModal = this.okModal.bind(this);
		this.cancelModal = this.cancelModal.bind(this);
	}

	componentWillMount() {
		
	}
	getValueAndNames = () => {
		console.log(this.state);
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
					taskId: item, taskName: names[index]
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

	showModal = (o) => {
		if (!this.props.disabled) {
			this.setState({ showModal: true });
			this.modalProps.onShow && this.modalProps.onShow();
		}
	}
	okModal = (valueAndNames) => {
		this.hideModal();
		valueAndNames = valueAndNames ? valueAndNames : [];
		let values = [];
		let names = [];
		let code = [];
		valueAndNames.forEach(function (item, index) {
			values.push(item.taskId);
			names.push(item.taskName);
			code.push(item.taskCode);
		});
		let name = names.join(",");

		const { setFieldsValue,getFieldProps } = this.props.form;
		setFieldsValue({ [this.props.field_name + "_label"]: name,[this.props.field_name]: values.join(",") });
		setFieldsValue({"task_code":code});
		const original = values.map((value, index) => {
			return { key: value, taskCode: value, taskName: names[index] }
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
			rules: this.props["data-meta"].rules
		});
		console.log(labelFieldProps);
		return (
			<div clastaskName="modal" >
				<VpFInput
					{...labelFieldProps}
					clastaskName="cursor"
					readOnly={true}
					label={this.props.label}
					placeholder={this.props.placeholder}
					labelCol={this.props.labelCol}
					wrapperCol={this.props.wrapperCol}
					onClick={this.showModal}
					suffix={<VpIcon type='search' style={{ marginTop: 5 }} />}
				/>
				<VpModal
					title={this.props.label}
					visible={this.state.showModal}
					onOk={this.okModal}
					onCancel={this.cancelModal}
					width={'70%'}
					wrapClastaskName='modal-no-footer dynamic-modal'
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
			</div>
		)
	}
}