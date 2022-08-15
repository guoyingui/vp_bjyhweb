//init config
(function () {
    var docId = vpUtils.resource.docId;
    var busSceneCode = vpUtils.resource.busSceneCode;
    /**
     * 配置 基础版本请求地址
     */
    window.config = {
        //判断是否开发模式
        isDev : vpCommons.isBoolean(vp.config.URL.devflag) ? vp.config.URL.devflag : false,
        /**
         * 转换代理地址
         * @param url 网关假名地址
         */
        geteway : function (url) {
            return vp.gateway.handleGateWay(url);
        },
        /**
         * 获取uedtior地址
         */
        getUeditorUrl : function () {
            if (config.isDev) {
                return config.geteway("{vpodm}/odm/ueditor/json/index");
            } else {
                return config.geteway("zuul/{vpodm}/odm/ueditor/json/index");
            }
        },
        /**
         * 获取文档ID
         * @return {string} 文档ID
         */
        getDocId : function () {
            return docId;
        },

         /**
         * 获取文档ID
         * @return {string} 文档ID
         */
        getSceneCode : function () {
            return busSceneCode;
        },

        /**
         * 抓取文档基本信息
         */
        docUrl: function () {
            return config.geteway('{vpodm}/odm/doc/info/' + config.getDocId());
        },

        /**
         * 抓取导航树数据
         */
        navTreeUrl: function () {
            return config.geteway('{vpodm}/odm/wordDocOutline/tree0?docId=' + config.getDocId());
        },

        /**
         * 抓取上传大纲文档树
         */
        uploadTreeUrl:function(){
            return config.geteway('{vpodm}/odm/doc/uploadTree?docId=' + config.getDocId());
        },

        /**
         * 抓取内容
         */
        contentUrl : function () {
            return config.geteway('{vpodm}/odm/doc/pageDocOutlineContent?docId=' + config.getDocId());
        },

        /**
         * 加内容
         */
        addContentUrl:function(){
            return config.geteway('{vpodm}/odm/wkItm/addContent');
        },

        /**
         * 删除大纲
         */
        deleteOutlineUrl : function () {
            return config.geteway('{vpodm}/odm/wordDocOutline/delete?docId=' + config.getDocId());
        },

        /**
         * 设置管控点
         */
        setControlPointUrl : function () {
            return config.geteway('{vpvrm}/vrm/ctlPointProxy/setControlPoint?docId=' + config.getDocId());
        },

        /**
         * 取消管控点
         */
        cancelControlPoint : function () {
            return config.geteway('{vpvrm}/vrm/ctlPointProxy/cancelControlPoint?docId=' + config.getDocId());
        },

        /**
         * 只设置条目标示
         */
        onlySetControlPoint : function () {
            return config.geteway('{vpodm}/odm/controlPoint/setControlPoint?docId=' + config.getDocId());
        },

        /**
         * 只取消条目标示
         */
        onlyCancelControlPoint : function () {
            return config.geteway('{vpodm}/odm/controlPoint/cancelControlPoint?docId=' + config.getDocId());
        },

        /**
         * 更新管控点
         */
        updateControlPoint : function () {
            return config.geteway('{vpvrm}/vrm/ctlPointProxy/updateControlPoint?docId=' + config.getDocId());
        },

        /**
         * 更新管控点 适用odm
         */
        updateControlPointUseodm : function () {
            return config.geteway('{vpvrm}/odm/controlPoint/updateControlPoint?docId=' + config.getDocId());
        },

        /**
         * 查看修订记录页面
         */
        toRevise : function () {
            return 'view/wd-core/reviselist.html';
        },

        /**
         * 跳转添加修订记录页面
         */
        toAddRevise:function(){
            return 'view/wd-core/addrevise.html';
        },

        /**
         * 修订记录获取数据
         */
        getReviseRecord : function () {
            return  config.geteway('{vpodm}/odm/docRevise/listPage?docId='+ config.getDocId());
        },

        /**
         * 查看修订记录页面
         */
        toLock : function () {
            return 'view/wd-core/locklist.html?docId='+ config.getDocId();
        },

        /**
         * 修订记录获取数据
         */
        getLockType : function () {
            return config.geteway('{vpodm}/odm/doc/docRecordLock/getDocLockType?docId='+ config.getDocId());
        },
        /**
         * 修订记录获取数据
         */
        getLockRecord : function () {
            return config.geteway('{vpodm}/odm/doc/docRecordLock/listDocLock?docId='+ config.getDocId());
        },

        /**
         * 删除条目
         */
        deleteWkItmUrl:function(){
            return config.geteway('{vpodm}/odm/wkItm/delete');
        },

        /**
         * 批量设置管控点
         */
        toControlPoint:function(){
            return 'view/wd-core/controlpoint.html';
        },

        /**
         * 重命名大纲
         */
        toOutlineRename:function(){
            return 'view/wd-core/resetname.html';
        },

        /**
         * 重命名大纲
         */
        outlineRename:function(){
            return config.geteway('{vpodm}/vrm/outlineProxy/rename');
        },

        /**
         * 新增大纲页面
         */
        toAddOutline:function(){
            return 'view/wd-core/addoutline.html';
        },

        /**
         * 新增大纲
         */
        addOutline:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/addOutlines?docId='+ config.getDocId());
        },

        /**
         * 验证同一父节点下是否重复
         */
        checkOutline:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/check?docId='+ config.getDocId());
        },

        /**
         * 获取下载任务ID
         */
        getOperTaskIdUrl:function(){
            return config.geteway('{vpodm}/odm/wkItm/getOperTaskId');
        },

        /**
         * 下载文档
         */
        downloadWkItmUrl : function(){
            return config.geteway('{vpodm}/odm/wkItm/downloadDocWkItm');
        },

        /**
         * 上传条目内容
         */
        uploadWkItmUrl:function(){
            if (confirm.isDev) {
                return config.geteway('{vpodm}/odm/wkItm/upload');
            } else {
                return config.geteway('zuul/{vpodm}/odm/wkItm/upload');
            }
        },

        /**
         * 设置起始章节号
         */
        toSetStart:function(){
            return 'view/wd-core/setstart.html';
        },


        /**
         * 验证章节号是否有效
         */
        vaidLevel:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/vaidLevel?docId='+ config.getDocId());
        },

        /**
         * 设置起始章节号
         */
        setStart:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/setStartNum?docId='+ config.getDocId());
        },

        /**
         * 查询条目内容
         */
        getWkItmContent:function(){
            return config.geteway('{vpodm}/odm/wkItm/getWkItmContent');
        },

        /**
         * 保存内容
         */
        saveContentUrl:function(){
            return config.geteway('{vpodm}/odm/wkItm/saveContent');
        },
        /**
         * 上传条目内容
         */
        uploadWkItm:function(){
            return 'view/wd-core/uploadwkitm.html';
        },

        /**
         * 检查大纲是否被锁
         */
        checkOutlineLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/checkLock');
        },

        /**
         * 检查大纲是否被锁(包含其子大纲)
         */
        checkLockChild:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/checkLockChild');
        },

        /**
         * 获取所有子大纲ID
         */
        getChildOutlineIds:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/getChileOutlineIds');
        },

        /**
         * 检查条目是否存在
         */
        checkWkitmExistUrl:function(){
            return config.geteway('{vpodm}/odm/wkItm/checkWkitmExist');
        },

        /**
         * 检查大纲是否存在
         */
        checkOutlineExist:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/isExist');
        },

        /**
         * 大纲升级/降级
         */
        outlineUpGrade:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/changeGrade?docId='+config.getDocId());
        },

        /**
         * 保存大纲锁信息
         */
        saveDocOutlineLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/saveDocOutlineLock');
        },

        /**
         * 添加文档锁信息
         */
        saveDocLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/saveDocLock?docId='+config.getDocId());
        },

        /**
         * 添加大纲下载锁信息
         * @author qinlz
         */
        saveDocOutlineDownloadLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/saveDocOutlineDownloadLock');
        },

        /**
         * 删除大纲下载锁信息
         * @author qinlz
         */
        deleteDocOutlineDownloadLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/deleteDocOutlineDownloadLock');
        },

        /**
         * 删除文档锁信息
         */
        deleteDocLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/deleteDocLock/'+config.getDocId());
        },

        /**
         * 删除文档大纲锁信息
         */
        deleteDocOutlineLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/deleteDocOutlineLock');
        },

        /**
         * 页面加载里添加锁
         */
        listLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/list?docId='+config.getDocId());
        },

        /**
         * 查询大纲管控点等等状态
         */
        getPoint:function(){
            return config.geteway('{vpvrm}/vrm/ctlPointProxy/getPoint?docId='+config.getDocId());
        },

         /**
         * 检查文件是否存在
         */
        checkFileExistUrl:function(){
            return config.geteway('{vpodm}/odm/atch/checkFileExist');
        },

        /**
         * 下载附件
         */
        downloadAtchUrl:function(){
            return config.geteway('{vpodm}/odm/atch/downloadAtch');
        },
        
        /**
         * 页面加载里添加锁
         */
        downloadTask:function(){
            return config.geteway('{vpodm}/odm/doc/getOperTaskId?docId='+config.getDocId());
        },

        /**
         * 页面加载里添加锁
         */
        downloadFile:function(){
            return config.geteway('{vpodm}/odm/doc/download');
        },

         /**
         * 查询是文档是否有非自身锁
         */
        listOtherLock:function(){
            return config.geteway('{vpodm}/odm/doc/docRecordLock/listOtherLock?docId='+config.getDocId());
        },

        /**
         * 上传文档
         */
        uploadDoc:function(){
            return 'view/wd-core/uploaddoc.html';
        },

        /**
         * 上传文档大纲
         */
        uploadDocOutline:function(){
            return 'view/wd-core/uploaddocoutline.html';
        },

        /**
         * 比较上传大纲
         */
        uploaddocoutlineconfirm:function(){
            return 'view/wd-core/uploaddocoutlineconfirm.html';
        },

         /**
         * 上传文档
         */
        uploadDocUrl:function(){
            if (config.isDev) {
                return config.geteway('{vpodm}/odm/doc/uploadDocCheck?docId='+config.getDocId());
            } else {
                return config.geteway('zuul/{vpodm}/odm/doc/uploadDocCheck?docId='+config.getDocId());
            }
        },

        /**
         * 上传大纲文档
         */
        uploadDocOutlineUrl:function(){
            if (config.isDev) {
                return config.geteway('{vpodm}/odm/doc/uploadDocOutlineCheck?docId='+config.getDocId());
            } else {
                return config.geteway('zuul/{vpodm}/odm/doc/uploadDocOutlineCheck?docId='+config.getDocId());
            }
        },

        /**
         * 保存上传大纲文档
         */
        saveUploadDeleteOutline : function () {
            return config.geteway('{vpvrm}/odm/doc/saveUploadDeleteOutline?docId=' + config.getDocId());
        },

         /**
         * 导入大纲文档
         */
        toImportOutline:function(){
            return 'view/wd-core/importouline.html';
        },
        /**
         * 获取修订内容前后内容
         */
        getWkItmDiffHtmlUrl:function(){
            return config.geteway('{vpodm}/odm/docRevise/getWkItmDiffHtml');
        },

        /**
         * 导入大纲文档
         */
        importOutline:function(){
            if (config.isDev) {
                return config.geteway('{vpodm}/odm/wordDocOutline/importFile?docId='+config.getDocId());
            } else {
                return config.geteway('zuul/{vpodm}/odm/wordDocOutline/importFile?docId='+config.getDocId());
            }
        },


        /**
         * 获取大纲前后内容
         */
        getOutlineDiffHtmlUrl:function(){
            return config.geteway('{vpodm}/odm/docRevise/getOutlineDiffHtml');
        },

        /**
         * 保存修订记录
         */
        saveReviseUrl:function(){
            return config.geteway('{vpodm}/odm/docRevise/save');
        },

        /**
         * 删除修订记录
         */
        deleteReviseUrl:function(){
            return config.geteway('{vpodm}/odm/docRevise/delete?docId='+config.getDocId());
        }, 

        queryReviseCount:function(){
            return config.geteway('{vpodm}/odm/docRevise/queryReviseCount?docId='+config.getDocId());
        },
         /**
         * 下载修订记录
         */
        downLoadRevises:function(){
            return config.geteway('{vpodm}/odm/docRevise/downLoadRevises?docId='+config.getDocId());
        },

         /**
         * 大纲移动
         */
        moveOutline:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/move?docId='+config.getDocId());
        },
        /**
         * 查找有修订记录的大纲ID
         */
        listOutLineIdsUrl:function(){
            return config.geteway('{vpodm}/odm/docRevise/listOutLineIds?docId='+config.getDocId());
        },
    
        senceUrl : function () {
            return config.geteway('{vpodm}/odm/doc/docBusSceneOper/getBusSceneOper?busSceneCode='+config.getSceneCode());
        },

         /**
         * 获取解析内容提示页面
         */
        processHtml:function(){
            return 'view/wd-core/process.html';
        },

         /**
         * 获取下载内容提示页面
         */
        downloadHtml:function(){
            return 'view/wd-core/download.html';
        },
        /**
         * 查找有修订记录的大纲ID
         */
        chapNums:function(){
            return config.geteway('{vpodm}/odm/wordDocOutline/chapNums?docId='+config.getDocId());
        },

        /**
         * 查询元素模板数据
         */
        selectDocArtTpl: function () {
            return config.geteway('{vpvrm}/vrm/docArtTempl/selectDatas');
        },
        /**
         * 查询元素模板数据(分页)
         */
        selectPageDocArtTpl: function () {
            return config.geteway('{vpvrm}/vrm/docArtTempl/selectPageDocArtTpl');
        },

        /**
         * 使用元素模板新增大纲
         */
        addOutlinesByArtTpl: function () {
            return config.geteway('{vpvrm}/vrm/outlineProxy/addOutlinesByArtTpl?docId='+config.getDocId());
        },

        /**
         * 使用元素模板新增大纲
         */
        getDocArtInsInfo: function () {
            return config.geteway('{vpvrm}/vrm/docArt/getInsInfo');
        },

        /**
         * 增加通知需求条目状态更改推送
         */
        subscribeDocArtChangeUrl : function () {
            return config.geteway('{vpvrm}/vrm/docArt/subscribe/change');     
        },
         /**
         * 设置起始章节号
         */
        reqKitBoxHtml:function(){
            return 'view/wd-ext/reqkitbox.html';
        },
        /**
         * 设置起始章节号
         */
        assetframeHtml:function(){
            return 'view/wd-ext/reqkitboxtab/assetframe.html';
        },
        /**
         * 设置起始章节号
         */
        docarttplHtml:function(){
            return 'view/wd-ext/reqkitboxtab/docarttpl.html';
        },
        /**
         * 设置起始章节号
         */
        reqassetHtml:function(){
            return 'view/wd-ext/reqkitboxtab/reqasset.html';
        },
        /**
         * 资产结构树
         */
        assetFrameUrl:function(){
            return config.geteway('{vpvrm}/vrm/assetStruct/tree');
        },

        /**
         * @author qinlz
         * 获取文档内容
         */
        getDocArtTplContent:function(){
            return config.geteway('{vpodm}/odm/doc/getDocContent');
        },

        /**
         * 获取需求资产
         */
        getPathListPage:function(){
            return config.geteway('{vpvrm}/vrm/assetStruct/getPathListPage');
        }
    }
})(window);