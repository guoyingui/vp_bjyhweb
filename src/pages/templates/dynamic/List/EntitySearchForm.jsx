import React from 'react';
import {
    VpButton,
    VpModal,
    VpInput,
    VpRadioGroup,
    VpRadio,
    VpSelect,
    VpOption,
    VpDatePicker,
    VpCol,
    VpRow,
    VpCheckbox,
    VpIcon,
    VpRangePicker
} from 'vpreact';
import { NotFind } from 'vplat';
//import Choosen from '../ChooseEntity/ChooseEntity';
import { requireFile } from 'utils/utils';

export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showState: false,
            item: {},
            choosenIds: {},
            express: {},
            keys: {},
            selectValue: {},
            radioValue: {},
            checkboxValue: {},
            dateValue: {},
            reflushKey: 0,
            formData: {}
        }
        this.props.onRef(this);
    }

    componentWillMount() {

    }
    componentDidMount() {
       
    }
    componentWillReceiveProps(nextProps) {

    }
    showModal = (item) => {
        this.setState({
            showState: true,
            item: item
        })
    }
    cancelChoosen = () => {
        this.setState({
            showState: false
        })
    }
    submitChoosen = (selectItem) => {
        let snames = ''
        let ids = ''
        selectItem.map((item, index) => {
            if (index != 0) {
                snames += ','
                ids += ','
            }
            snames += item.sname
            ids += item.iid
        })
        let id = this.state.item.field_name
        $('#' + id).val(snames)
        this.state.choosenIds[id] = ids
        this.setState({
            showState: false
        })
    }
    multipleSearch = () => {
        let inputVals = {}
        $('.inputVal').map((index, item) => {
            inputVals[$(item).attr('id')] = $(item).val()
        })
        let searchData = []
        let formData = this.props.formData.groups;
        let map = {};
        if (formData && formData.length > 0) {
            if (formData[0] != undefined) {
                formData[0].fields.map((item, index) => {
                    map[item.field_name] = item.widget_type
                })
            }
        }
        let { express, selectValue, choosenIds, radioValue, checkboxValue, dateValue } = this.state
        Object.keys(map).forEach((key, i) => {
            let item = {}
            let name = key
            let widget = map[key]
            item.field_name = name
            item.expression = express[name]
            if (widget == 'text' || widget == 'number') {
                item.field_value = inputVals[name]
            } else if (widget == 'select' || widget == 'multiselect') {
                item.field_value = selectValue[name]
            } else if (widget == 'selectmodel' || widget == 'multiselectmodel') {
                item.field_value = choosenIds[name]
            } else if (widget == 'radio') {
                item.field_value = radioValue[name]
            } else if (widget == 'checkbox') {
                item.field_value = checkboxValue[name]
            } else if (widget == 'date') {
                item.field_value = dateValue[name]
            }
            searchData.push(item)
        })
        let filterdata = searchData.filter((item) => {
            return item.field_value != undefined && item.field_value != ''
        })
        this.props.handleSearchForm(filterdata)
    }
    handleExpress = (value, field_name) => {
        this.state.express[field_name] = value
        this.setState({
            express: this.state.express
        })
    }
    handleSelect = (value, field_name) => {
        this.state.selectValue[field_name] = value.join(',')
    }
    handleRadio = (e, field_name) => {
        this.state.radioValue[field_name] = e.target.value
    }
    handleCheckbox = (value, field_name) => {
        this.state.checkboxValue[field_name] = value.join(',')
    }
    handleDate = (value, field_name) => {
        if (this.state.express[field_name] == 'between' || value.length == 2) {
            if (value[0] != '' && value[1] != '') {
                this.state.dateValue[field_name] = value.join()
            } else {
                this.state.dateValue[field_name] = ""
            }
        } else {
            this.state.dateValue[field_name] = value
        }

    }
    clearSearch = () => {
        this.state.reflushKey++
        this.setState({
            express: {},
            selectValue: {},
            radioValue: {},
            checkboxValue: {},
            reflushKey: this.state.reflushKey,
            choosenIds: [],
            dateValue: {}
        })
    }
    dynamicForm = (item) => {
        const _this = this
        const dateSelect = (
            <VpSelect id={field_name + 'sel'} style={{ width: '100%' }} onChange={(value) => _this.handleExpress(value, item.field_name)}>
                <VpOption value="gt">大于</VpOption>
                <VpOption value="egt">大于等于</VpOption>
                <VpOption value="eq">等于</VpOption>
                <VpOption value="lt">小于</VpOption>
                <VpOption value="elt">小于等于</VpOption>
                <VpOption value="between">区间内</VpOption>
            </VpSelect>
        )
        const numSelect = (
            <VpSelect id={field_name + 'sel'} style={{ width: '100%' }} onChange={(value) => _this.handleExpress(value, item.field_name)}>
                <VpOption value="gt">大于</VpOption>
                <VpOption value="egt">大于等于</VpOption>
                <VpOption value="eq">等于</VpOption>
                <VpOption value="lt">小于</VpOption>
                <VpOption value="elt">小于等于</VpOption>
            </VpSelect>
        )
        const select = (
            item.widget_type == 'date' || item.widget_type == 'datetime' ? dateSelect :
                numSelect
        )
        let type = item.hasOwnProperty('widget_type') ? item.widget_type : "text";
        let field_label = item.hasOwnProperty('field_label') ? item.field_label : '';
        let field_name = item.hasOwnProperty('field_name') ? item.field_name : 'dynamicForm_' + coun++;
        switch (type) {
            case 'select':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={17} >
                                <VpSelect id={field_name + 'val'} style={{ width: '100%' }} onChange={(value) => _this.handleSelect(value, field_name)}>
                                    {!(item.hasOwnProperty('widget') ? (item.widget.hasOwnProperty('load_template') ? true : false) : '') ? null :
                                        item.widget.load_template.map((option, index) => {
                                            return (
                                                <VpOption
                                                    key={index}
                                                    value={option.hasOwnProperty('value') ? option.value : ''}>
                                                    {option.hasOwnProperty('label') ? option.label : ''}
                                                </VpOption>
                                            );
                                        })
                                    }
                                </VpSelect>
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            case 'multiselect':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={17}>
                                <VpSelect multiple id={field_name + 'val'} style={{ width: '100%' }} onChange={(value) => _this.handleSelect(value, field_name)}>
                                    {!(item.hasOwnProperty('widget') ? (item.widget.hasOwnProperty('load_template') ? true : false) : '') ? null :
                                        item.widget.load_template.map((option, index) => {
                                            return (
                                                <VpOption
                                                    key={index}
                                                    value={option.hasOwnProperty('value') ? option.value : ''}>
                                                    {option.hasOwnProperty('label') ? option.label : ''}
                                                </VpOption>
                                            );
                                        })
                                    }
                                </VpSelect>
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            case 'radio':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={17} style={{ marginTop: 5 }}>
                                <VpRadioGroup
                                    onChange={(e) => _this.handleRadio(e, field_name)}
                                >
                                    {!(item.hasOwnProperty('widget') ? (item.widget.hasOwnProperty('load_template') ? true : false) : '') ? null :
                                        item.widget.load_template.map((option, index) => {
                                            return (
                                                <VpRadio
                                                    key={index}
                                                    value={option.hasOwnProperty('value') ? option.value : ''}>
                                                    {option.hasOwnProperty('label') ? option.label : ''}
                                                </VpRadio>
                                            );
                                        })
                                    }
                                </VpRadioGroup>
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            case 'checkbox':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={17} style={{ marginTop: 5 }}>
                                <VpCheckbox
                                    options={item.hasOwnProperty('widget') ?
                                        (item.widget.hasOwnProperty('load_template') ?
                                            item.widget.load_template
                                            : [])
                                        : []}
                                    onChange={(value) => _this.handleCheckbox(value, field_name)}
                                />
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            case 'date':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={8}>
                                {select}
                            </VpCol>
                            <VpCol span={9} style={{ marginLeft: 5 }} >
                                {
                                    _this.state.express[field_name] == 'between' ?
                                        <VpRangePicker format="yyyy/MM/dd" getCalendarContainer={triggerNode => triggerNode.parentNode}
                                            onChange={(value, dateString) => _this.handleDate(dateString, field_name)} />
                                        :
                                        <VpDatePicker getCalendarContainer={triggerNode => triggerNode.parentNode}
                                            onChange={(value, dateString) => _this.handleDate(dateString, field_name)} />
                                }
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            case 'datetime':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={8}>
                                {select}
                            </VpCol>
                            <VpCol span={9} style={{ marginLeft: 5 }}>
                                {
                                    _this.state.express[field_name] == 'between' ?
                                        <VpRangePicker showTime format="yyyy/MM/dd" getCalendarContainer={triggerNode => triggerNode.parentNode}
                                            onChange={(value, dateString) => _this.handleDate(dateString, field_name)} />
                                        :
                                        <VpDatePicker getCalendarContainer={triggerNode => triggerNode.parentNode}
                                            onChange={(value, dateString) => _this.handleDate(dateString, field_name)} />
                                }
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            case 'selectmodel':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={17} >
                                <VpInput
                                    id={field_name}
                                    onClick={() => _this.showModal(item)}
                                    // disabled={true}
                                    style={{ cursor: "pointer", backgroundColor: "#f7f7f7" }}
                                    readOnly
                                    suffix={<VpIcon type='search' style={{ marginTop: 7 }} />}
                                />
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            case 'multiselectmodel':
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            <VpCol span={17} >
                                <VpInput
                                    id={field_name}
                                    onClick={() => _this.showModal(item)}
                                    // disabled={true}
                                    style={{ cursor: "pointer", backgroundColor: "#f7f7f7" }}
                                    readOnly
                                    suffix={<VpIcon type='search' style={{ marginTop: 7 }} />}
                                />
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
            default:
                let flag = field_name.indexOf("f") == 0 || field_name.indexOf("d") == 0 ? false : true
                return (
                    <VpCol style={{ marginTop: 15 }} key={field_name} sm={24}>
                        <VpRow>
                            <VpCol style={{ marginTop: 5 }} span={6} className="text-right p-lr-sm">{field_label}:</VpCol>
                            {flag ? '' : <VpCol span={8}>
                                {select}
                            </VpCol>}
                            <VpCol span={flag ? 17 : 9} style={flag ? {} : { marginLeft: 5 }}>
                                <VpInput type={type} className='inputVal' id={field_name} />
                            </VpCol>
                        </VpRow>
                    </VpCol>
                );
                break;
        }
    }

    showChoosen = () => {
        let item = this.state.item
        let url = item.url
        if (url != '' && url != undefined) {
            let Content = requireFile(url)
            return (
                <Content
                    item={{ irelationentityid: this.state.item.irelationentityid }}
                    initValue={[]}
                    params={{}}
                    onCancel={() => this.cancelChoosen()}
                    onOk={(selectItem) => this.submitChoosen(selectItem)}
                />
            )
        } else {
            return <NotFind />
        }

    }

    render() {
        if (!this.props.formData.groups || !this.props.formData.groups.length) {
            return null;
        }
        const formData = this.props.formData.groups || []
        return (
            <VpRow key={this.state.reflushKey + '' + this.props.entityid}>
                {
                    formData[0] != undefined ?
                        formData[0].fields.map((item, index) => {
                            return (
                                <div key={index}>
                                    {this.dynamicForm(item)}
                                </div>
                            )

                        })
                        : ''
                }
                <VpCol sm={24} className="text-center p-sm">
                    <VpButton className="vp-btn-br" type="primary" onClick={this.multipleSearch}>搜索</VpButton>
                    <VpButton type="ghost" className="m-l-sm vp-btn-br" onClick={this.clearSearch}>清除</VpButton>
                    <VpButton className="m-l-sm vp-btn-br" type="ghost" onClick={this.props.cancelSearch ? this.props.cancelSearch : ''}>取消</VpButton>
                </VpCol>
                <VpModal
                    title={'选择' + this.state.item.field_label}
                    visible={this.state.showState}
                    width={'70%'}
                    footer={null}
                    chooseModalVisible={this.props.chooseModalVisible ? this.props.chooseModalVisible(this.state.showState) : null}
                    wrapClassName='modal-no-footer'
                    onCancel={() => this.cancelChoosen()}
                >
                    {
                        this.state.showState ?
                            this.showChoosen()
                            : ''
                    }
                </VpModal>
            </VpRow>
        )
    }
};
