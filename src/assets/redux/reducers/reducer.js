
const initState = {
};
export default function reducer(state = initState, action) {
    switch (action.type) {
      case 'CHANGE_lANGUAGE':
        return {
          ...state,
          language: action.language||'zh'
        }
        case 'HELLO':
            return {
                ...state,
                msg:action.msg
            }
        case 'form.submiting':
            return {
                ...state,
                submiting:action.submiting
            }
        case 'list.querying':
            var queryParams = state[action.id]||{};
            return {
                ...state,
                [action.id]:{
                    ...queryParams,
                    ...action.queryParams
                }
            }
        /**
         * 更新上下文中数据
         * 如果context已经有对应数据，则合并数据，如果没有则添加
         * 如：原来context={
         *     queryParam:{
         *         param1:1,
         *         param2:2
         *     },
         *     formsubmiting:true
         * }
         * state.data={
         *     queryParam:{
         *         param1:'新值',
         *     },
         * }
         * 则新的context值为{
         *     queryParam:{
         *         param1:'新值',
         *         param2:2
         *     },
         *     formsubmiting:true
         * }
         */
        case 'context.set':
            var context = state[action.id];
            //如果没有值或者值为空，则直接将state.data放入context中
            if(context == null || action.data == null){
                return {
                    ...state,
                    [action.id]:{
                        ...action.data
                    }
                }
            }
            //如果有值，则合并state.data内部的值
            Object.keys(action.data).forEach((item,index) => {
                if(typeof action.data[item] === 'object'){
                    //如果时对象类型的，则合并对象数据
                    if(context[item] == null){
                        context[item] = {...action.data[item]}
                    }else{
                        context[item] = {...context[item],...action.data[item]}
                    }
                }else{
                    //如果是非对象类型的，则直接替换
                    context[item] = action.data[item];
                }

            })
            return {
                ...state,
                [action.id]:context
            }
        /**
         * 替换上下文中数据
         * 如果context已经有对应数据，则替换数据，如果没有则添加
         * 如：原来context={
         *     queryParam:{
         *         param1:1,
         *         param2:2
         *     },
         *     formsubmiting:true
         * }
         * state.data={
         *     queryParam:{
         *         param1:'新值',
         *     },
         * }
         * 则新的context值为{
         *     queryParam:{
         *         param1:'新值',
         *     },
         *     formsubmiting:true
         * }
         *
         */
        case 'context.replace':
            var context = state[action.id];
            //如果没有值或者值为空，则直接将state.data放入context中
            if(context == null || action.data == null){
                return {
                    ...state,
                    [action.id]:{
                        ...action.data
                    }
                }
            }
            //如果有值，则替换state.data内部的值
            Object.keys(action.data).forEach((item,index) => {
                context[item] = {...action.data[item]} //直接用新值替换
            })
            return {
                ...state,
                [action.id]:context
            }
        case 'context.delete':
            var context = state[action.id];
            //如果没有值或者值为空，则不需要改变state
            if(context == null || action.data == null){
                return state;
            }

            //如果有值，则根据state.data内部的值删除
            if(typeof action.data === 'object'){
                Object.keys(action.data).forEach((item,index) => {
                    context[item] != null && delete context[item];
                })
            }
            return {
                ...state,
                [action.id]:context
            }
        /**
         * 清除整个context
         */
        case 'context.clear':
            delete state[action.id];
            return state;
    default:
        return state;
    }
}