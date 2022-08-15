import React, { Component } from 'react';

import RelationList from '../../../templates/dynamic/List/RelationList';

/**
 * 关联实体列表公共页面
 */
class baseRelationList extends RelationList.Component {
    constructor(props) {
        super(props);
    }
}

baseRelationList = RelationList.createClass(baseRelationList);

export default baseRelationList;