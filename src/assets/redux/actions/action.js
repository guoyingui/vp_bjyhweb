export const  changeLanguage = language => {
    return {
        type: 'CHANGE_lANGUAGE',
        language: language
    }
  }

  export const hello = (msg) => {
    return {
        type:'HELLO',
        msg:msg
    }
  }
  
  /**
   * 表单加载中
   * @修改记录 20190521 此方法已作废，请使用setContext方法
   */
  export const formsubmiting = (id,submiting) => {
    return {
        id:id,
      type:"form.submiting",
      submiting:submiting
    }
  }

/**
 * 查询条件变更
 * @param queryParams
 * @returns {{submiting: *, type: string}}
 */
  export const changeQueryParams = (id,queryParams) =>{
      return {
          type:"list.querying",
          id:id,
          queryParams:queryParams
      }
  }


/**
 * 设置上下文值
 * @param data
 */
export const setContext = (contextid,data) => {
      return {
          id:contextid,
          type:'context.set',
          data:data
      }
}
/**
 * 更新上下文值
 * @param data
 */
export const replaceContext = (contextid,data) => {
    return {
        id:contextid,
        type:'context.replace',
        data:data
    }
}

/**
 * 删除上下文值
 * @param data
 */
export const deleteContext = (contextid,data) => {
    return {
        id:contextid,
        type:'context.delete',
        data:data
    }
}
/**
 * 清空上下文值
 * @param data
 */
export const clearContext = (contextid) => {
    return {
        id:contextid,
        type:'context.clear'
    }
}