(function () {
    //至少16位
    var asekey = "VpAEF@@BbD36G7LP";
    var rid = vpUtils.Url.getUrlParam(window.location.href,'rid');
    var docId,busSceneCode;
    if (vpCommons.isNotEmpty(rid)) {
        vp.cookie.getAndSetToken(); //注入
        var resource = JSON.parse(vp.encrypt.aesDecrypt(rid, asekey));
        docId = resource.docId;
        busSceneCode = resource.busSceneCode;
    } else {
        docId = vpUtils.Url.getUrlParam(window.location.href, 'docId');
        busSceneCode = vpUtils.Url.getUrlParam(window.location.href, 'busSceneCode');
    }

    vpUtils.resource = vpUtils.resource || {};
    vpUtils.resource = {
        docId : docId,
        busSceneCode : busSceneCode
    }
})();


