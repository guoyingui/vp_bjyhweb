/*
  obj_wfs_info 已经执行流程步骤信息

  dataObj.flowid = flowid;
  dataObj.flowexpid = flowexpid;
  dataObj.stepid = stepid;
  dataObj.stepexpid = stepexpid;
  dataObj.objectid = objectID;
  dataObj.objecttype = objecttype;
  dataObj.formtype = formtype;
  dataObj.savetag = flag;
  dataObj.formid = formid;

  // 记录下流程后续步骤信息
  stepIds = '';
  stepNames = '';
*/

/*
  供初始化后续步骤处理人使用
 */
function initStepUser(dataObj) {
}

/*
  供有分支步骤时验证后续步骤处理人必须填写使用
 */
function checkStepUser(dataObj) {
	return true;
}

