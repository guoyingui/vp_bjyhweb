function WebOffice2015() {
	this.dVersion="2.16.1.1";
    this.dUpdateDate="2016-1-1";
    this.FileType = ""; // FileType:�ĵ����� .doc .xls .wps
    this.obj; // obj��object ����
    this.Status = "";               //Status��״̬��Ϣ
    this.ShowDialog = {// ö����ʾϵͳ�Ϳؼ��������ضԻ�������
        DialogNew: 0, // �½�����
        DialogOpen: 1, // ��
        DialogSaveAs: 2, // ���Ϊ
        DialogSaveCopyAs: 3, // ���Ϊ����
        DialogPrint: 4, // ��ӡ
        DialogPageSetup: 5, // ��ӡ����
        DialogProperties: 6
        // �ĵ�����
    }
    this.FileName = ""; 		//FileName:�ĵ�����

    this.EditType = 0;

	this.UserName ="";
    this.setObj = function (object) {// ����2015����
        this.obj = object;
        this.WebObject = this.obj; //����VBA���ö���
		
    }

    this.DocType = {// ö�������ĵ���������ֻ�о�word 0,execl 1
        WOED: 0,
        EXECL: 1
    };

    this.HttpMethod = {
        Get: 0,        //Http����get��ʽ
        Post: 1      //Http����post��ʽ				
    };
    

    this.DOWN = "\\WebOffice\\Down\\"//ָ������·������������
    this.UP = "\\WebOffice\\UP\\"//ָ������·������������

    this.FilePath = null;  //�ĵ�·��

    this.tempInsertName = ""; //�����ļ����ļ�����

    this.DocTypeValue = { DOC: 0, DOCX: 16, XLS: 56, XLSX: 51 }; //ö�����е��ĵ�����ֵ�û�������

    this.DocSuffixType = { 0: ".doc", 12: ".docx", 56: ".xls", 51: ".xlsx" }; //���ݴ��ĵ����ͣ�����ȡ��׺����

    this.setVersion = -1;
    this.OfficeVersion = { v2003: 1, vOther: 0}  //�ж�Office�汾�����ֻҪ���ڱ��浽����

    this.WebObject = null; //����WebObject���󣬷������VBA ����

    this.sendMode = null //�����첽����ģʽ

    this.iWebOfficeTempName = "iWebOfficeTempName.doc"

    this.Caption = "DEMO��ʾƽ̨";
    this.SetCaption = function(){
	this.Caption="\""+this.UserName+"\"���ڱ༭�ĵ�";
	this.obj.Caption =this.Caption;
   }
   //���ÿؼ�����
    this.Caption = "DEMO��ʾƽ̨";
    this.SetCaption = function(){
	this.Caption="\""+this.UserName+"\"���ڱ༭�ĵ�";
	this.obj.Caption =this.Caption;
    }
    //������дǩ���û�
    this.SetUser = function(username){
		this.obj.User = username;
	}

    /*
    * @deprecated:�½�һ���ĵ���
    */
    this.CreateFile = function () {
        var docType = this.getDocType(this.FileType); // ��ȡ�ĵ�����
        switch (docType) {
            case this.DocType.WOED:
                this.obj.CreateNew("Word.Document"); // ����word
                break;
            case this.DocType.EXECL:
                this.obj.CreateNew("Excel.Sheet"); // ����execl
                break;
            default:
                this.obj.CreateNew("Word.Document"); // Ĭ�ϴ���word�ĵ�
                break;
        }
    }

    /*
    * ��ȡ�ĵ�����
    */
    this.getDocType = function (fileType) {
        if (fileType == ".doc" || fileType == ".docx" || fileType == ".wps") {// word
            return this.DocType.WOED;
        }
        if (fileType == ".xls" || fileType == ".xlsx" || fileType == ".et") {// execl
            return this.DocType.EXECL;
        }
    }

    this.HookEnabled = function () {//�����Firefox��chrome������µ���iWebPlugin����������������Ҫ��load()�����¼����´���
        if (this.getDocType(this.FileType) == this.DocType.WOED) {
            this.obj.Style.ShowToolSpace = true;
            this.obj.SelectionInformationEnabled = false;
        }
        if (!((window.ActiveXObject != undefined) || (window.ActiveXObject != null) || "ActiveXObject" in window)) {
            this.obj.HookEnabled = false;
        }
    }

    /******һ���Ǵ򿪱��ش��ڴ���******/
    // �򿪱��ش���
    this.WebOpenLocal = function () {
        this.setShowDialog(this.ShowDialog.DialogOpen, this
				.getOpenDocSuffix(this.FileType));
    }
    // ��ȡ�򿪴��ڵĺ�׺
    this.getOpenDocSuffix = function (fileType) {
        if (fileType.length == 5) {
            fileType = fileType.substring(0, 4);
        }
        var exts;
		exts = "";
		if(this.isWPS() || !this.getOfficeVersion()){//�����office2003�ǲ�֧��x��ʽ���ĵ�
			exts += "*" + fileType + "x|*" + fileType + "x|";
		}
        exts += "*" + fileType + "|*" + fileType + "|";
		exts += this.getOpenSuffixName(fileType) + "(*" + fileType 
		if(this.isWPS() || !this.getOfficeVersion()){//�����office2003�ǲ�֧��x��ʽ���ĵ�
			exts +=  ";*"+ fileType + "x"
		}
		exts +=  ")|*" + fileType 
        if(this.isWPS()|| !this.getOfficeVersion()){//�����office2003�ǲ�֧��x��ʽ���ĵ�
        	exts += ";*" + fileType + "x";
        }
		exts +="|";
        return exts;
    }
    //���ص�ǰ�༭��
    this.getEditVersion = function (){
       return this.obj.AppName;	
    }
    //��ȡ���ĵ���������
    this.getOpenSuffixName = function (fileType) {
        var openSuffixName;
        switch (fileType) {
            case this.DocType.WOED: openSuffixName = "Word Files"; break; //����word��׺����
            case this.DocType.EXECL: openSuffixName = "Excel Files"; break; //����execl��׺����
            default: openSuffixName = "Word Files"; break;
        }
        return openSuffixName;
    }

    //���ô򿪴��ڵ����ͣ�����ͳһ����
    this.setShowDialog = function (thisType, exts) {
    	switch (thisType) {
            case this.ShowDialog.DialogOpen: this.obj.ShowDialog(thisType, exts, 0); break; //�򿪱����ĵ�
            case this.ShowDialog.DialogNew: //�½�����
            case this.ShowDialog.DialogPageSetup: //��ӡ����
            case this.ShowDialog.DialogPrint: //��ӡ
            case this.ShowDialog.DialogProperties: //�ĵ�����
            case this.ShowDialog.DialogSaveCopyAs: //���Ϊ����
            case this.ShowDialog.DialogSaveAs: //���Ϊ
                this.blnIE() ? this.obj.ShowDialog(thisType) : this.obj.ExecuteScript(thisType + "", "ActiveObject.ShowDialog(" + thisType + ")"); break; //�򿪴���
            default: ; break;
        }
    }
    /******End �򿪱��ش��ڴ���******/

    /*�ĵ����浽���أ��жԻ���*/
    this.WebSaveLocal = function () {
        this.setShowDialog(this.ShowDialog.DialogSaveCopyAs);
    }
    /*2015�Դ��д��ڵ�ҳ������*/
    this.WebPageSetup = function () {
        this.setShowDialog(this.ShowDialog.DialogPageSetup);
    }
    /*2015�Դ��д��ڵĴ�ӡ����*/
    this.WebOpenPrint = function () {
        this.setShowDialog(this.ShowDialog.DialogPrint);
    }

    /*�ر��ĵ�*/
    this.WebClose = function(){ //����������ùر�
    	if (navigator.userAgent.indexOf("Firefox") >= 0){//ж��ʱ�򣬻������ʹ��close����
    		return;
    	}
    	this.Close();
    }

    //��ӡԤ��
    this.PrintPreview = function () {
        this.obj.PrintPreview();
    }
    //�˳���ӡԤ��
    this.PrintPreviewExit = function () {
        this.obj.PrintPreviewExit();
    }

    /*���ļ��˵���������˵����ṩ�Ľӿ� */
    var MenuFile;
    this.AppendMenu = function (index, Caption) {
        var custommenu = this.obj.CustomMenu;
        if (MenuFile == undefined || MenuFile == null) {
            custommenu.Clear();
            MenuFile = custommenu.CreatePopupMenu();
            custommenu.Add(MenuFile, "�ļ�(&F)");
        }
        custommenu.AppendMenu(MenuFile, index, false, Caption);
        custommenu.Update();
    }

    this.AddCustomMenu = function () {
        var custommenu = this.obj.CustomMenu;
        //�����ļ��˵�����Ŀ
        var menufile = custommenu.CreatePopupMenu();
        var menufilelv2 = custommenu.CreatePopupMenu();
        custommenu.AppendMenu(menufilelv2, 6, false, "�Զ�������˵�һ");
        custommenu.AppendMenu(menufilelv2, 7, false, "�Զ�������˵���");
        custommenu.AppendMenu(menufilelv2, 0, false, "-");
        var menufilelv3 = custommenu.CreatePopupMenu();
        custommenu.AppendMenu(menufilelv3, 8, false, "�Զ��������˵�һ");
        custommenu.AppendMenu(menufilelv3, 0, false, "-");
        custommenu.AppendMenu(menufilelv3, 9, false, "�Զ��������˵���");

        custommenu.AppendMenu(menufilelv2, menufilelv3, true, "�Զ��������˵�");

        custommenu.AppendMenu(menufilelv2, 10, false, "�Զ�������˵���");
        custommenu.AppendMenu(menufile, menufilelv2, true, "�Զ�������˵�");
        //���ļ��˵���ӵ��������˵�
        custommenu.AppendMenu(menufile, 17, false, "���ñ���");
        custommenu.AppendMenu(menufile, 18, false, "��ֹ����");
        custommenu.AppendMenu(menufile, 0, false, "-");
        custommenu.AppendMenu(menufile, 19, false, "���ô�ӡ");
        custommenu.AppendMenu(menufile, 20, false, "��ֹ��ӡ");
        custommenu.Add(menufile, "�༭(&E)");

        //��������
      /*  var menuLang = custommenu.CreatePopupMenu();
        custommenu.AppendMenu(menuLang, 22, false, "��������");
        custommenu.AppendMenu(menuLang, 23, false, "��������(TW)");
        custommenu.AppendMenu(menuLang, 24, false, "��������(HK)")
        custommenu.AppendMenu(menuLang, 25, false, "Ӣ��");
        custommenu.Add(menuLang, "������(&N)");*/

        //֪ͨϵͳ���²˵�
        custommenu.Update();
    }

    /*�ӷ�������ȡ�ĵ����򿪣���RecordIDָ�����ļ� */
    this.WebOpen = function (mBoolean) {
        var httpclient = this.obj.Http; //����http����
        httpclient.Clear();
        this.WebSetMsgByName("USERNAME", this.UserName); //����UserName
        this.WebSetMsgByName("FILENAME", this.FileName); //����FileName
        this.WebSetMsgByName("FILETYPE", this.FileType); //����FileType
        this.WebSetMsgByName("RECORDID", this.RecordID); //����RecordID
        this.WebSetMsgByName("OPTION", "LOADFILE");     //��������LOADFILE
        httpclient.AddForm("FormData", this.WebSendMessage()); //�������Զ���json �����ʽ��
        this.WebClearMessage();                         //�������WebSetMsgByName����
        if (this.LOADFILE(httpclient)) {                //Http���ط������ļ�   
            this.Status = "���ĵ��ɹ�";               //Status��״̬��Ϣ 
            return true;
        }
        this.Status = "���ĵ�ʧ��";               //Status��״̬��Ϣ 
        return false;
    }

    /*���浽����·�� FileName������·��*/
    this.WebSaveLocalFile = function (FileName) {
        this.WebDelFile(FileName);
        this.Save(FileName, this.getOfficeVersion(), this.FileType.substring(1).toUpperCase());
    }

    /*office2003�Ľӿں������Ĳ�һ�������б��浽����Ҫ���ֿ���*/
    this.Save = function (FileName, is2003, FileType) {
        if (is2003) {
            this.obj.Save(FileName);
            return;
        }
        this.obj.Save(FileName, eval("this.DocTypeValue." + FileType), true);
    }

    /*�����ļ�*/
    this.WebSave = function () {
        var httpclient = this.obj.Http; //����http���� 
        httpclient.Clear();               
        this.WebSetMsgByName("USERNAME", this.UserName);
        this.WebSetMsgByName("RECORDID", this.RecordID);
        this.WebSetMsgByName("OPTION", "SAVEFILE");
        this.WebSetMsgByName("FILENAME", this.FileName); //����FileName
        this.WebSaveLocalFile(this.getFilePath() + this.FileName);
        this.Close();
        if (this.SAVEFILE(httpclient, this.FilePath + this.FileName)) {
            this.Status = "�����ļ��ɹ�";
            return true;
        }
        this.Status = "�����ļ�ʧ��";
        return false;
    }

    this.SAVEFILE = function (httpclient, FileName) {//ʱ��������OPTIONֵΪ��SAVEFILE
        httpclient.AddForm("FormData", this.WebSendMessage());
        httpclient.AddFile("FileData", FileName);    //��Ҫ�ϴ����ļ�
        this.WebClearMessage();
	     httpclient.ShowProgressUI = false;           //���ؽ�����
        if (httpclient.Open(this.HttpMethod.Post, this.WebUrl, false)) {//�������ͬ����ʽ���ĵ�����Ҫ����ֵ
            if (!httpclient.Send()) {

                if (httpclient.Status == 0) {
                    if (!httpclient.Send()) {
                        return false;
                    }
                }
            }            
            httpclient.Clear();
            return true;
        }
        return false;
    }

    this.LOADFILE = function (httpclient) { //Http �����ĵ�
     httpclient.ShowProgressUI = true;//���ؽ�����
        if (httpclient.Open(this.HttpMethod.Post, this.WebUrl, false)) {//�������ͬ����ʽ���ĵ�����Ҫ����ֵ
            if (httpclient.Send()) {
                if (httpclient.GetResponseHeader("MsgError") == "404") { //�жϷ������Ƿ�����ļ�
                    this.CreateFile();
				this.getOfficeVersion();//���ĵ����жϵ�ǰoffice�汾
                    httpclient.Clear();
                    return true;
                }
                httpclient.Clear();
                if (this.hiddenSaveLocal(httpclient, this, false, false)) {//���سɹ�ʱ
				 if(this.OpenLocalFile(this.FilePath+this.FileName)==0){ //�򿪱��ش����ļ�
					 this.getOfficeVersion();//���ĵ����жϵ�ǰoffice�汾
                    return true;
				 }else{
					 var windows = window.confirm("���ĵ����󣬿��ܵ�ǰ�༭�����֧�ֵ�ǰ��ʽ��\r\r������ȷ�����رա�������ȡ����������");
					 if(windows == 1){
						 window.close(); 
                }
					 return false;
            }
	        }
		 }
            return false;
        }
    }

    /*��ȡ��ʱ·��*/
    this.getFilePath = function () {
        var fs = this.obj.FileSystem; //����file����
        var filePath = fs.GetSpecialFolderPath(0x1a) + this.UP; //������ʱ·��
        fs.CreateDirectory(filePath); //����·��   	
        this.FilePath = filePath; //������ֵ������ɾ���ʹ�
        return this.FilePath;
    }

    /*�򿪱��ش����ļ�*/
    this.OpenLocalFile = function (filePath) {
     	return this.obj.Open(filePath);
    }

    /*���浽����  isHidden �Ƿ������ļ���isInsertFile�Ƿ��ǲ����ļ�*/
    this.hiddenSaveLocal = function (httpclient, webOffice, isHidden, isInsertFile, OtherName) {
        if (isHidden) {
            httpclient.Hidden = true; //�����ļ�
        }
        var tempName = "";
        var fs = webOffice.obj.FileSystem; //WebOffice����������ƣ�
        var filePath = fs.GetSpecialFolderPath(0x1a) + webOffice.DOWN;
        fs.CreateDirectory(filePath);
        webOffice.FilePath = filePath; //��������·������򿪵�ʱ����ȡ��
        if (httpclient.Status == 200) {
            if (isInsertFile == undefined || isInsertFile == true) {
                tempName = "temp" + webOffice.RecordID;
                webOffice.tempInsertName = tempName + webOffice.FileName;
            }
            if (OtherName == undefined || OtherName == "") {
                OtherName = webOffice.FileName;
            }
            httpclient.ResponseSaveToFile(filePath + tempName + OtherName); //��ʱ�ļ�
        	httpclient.Clear();
            return true;
        }
        httpclient.Clear();
        return false;
    }

    //��ȡoffice�汾��Ϣ
    this.getOfficeVersion = function () {
    	var getVersion = 0.0;
        try {
    		if(this.setVersion == -1){
    			 getVersion = parseFloat(this.obj.ActiveDocument.Application.Version);
    			 this.setVersion = getVersion;
    		}else{
    			getVersion = this.setVersion;
    		}
            if (getVersion == 11.0) {
                return this.OfficeVersion.v2003;
            } else {
                return this.OfficeVersion.vOther;
            }
        } catch (e) {
            return this.OfficeVersion.v2003;
        }
    }


    //�ر��ĵ�
    this.Close = function () {
        this.obj.Close();
    }
    //��ȡ����
    this.Activate = function(blnValue){
    	this.obj.Activate(blnValue);
    }
    //����word��ҳ�� ,IE��������������������Է�װ����
    this.WebPageCode = function () {
        var FunctionString = "ActiveObject.ActiveDocument.Application.Dialogs(294).Show()";
        this.blnIE() ? this.obj.ActiveDocument.Application.Dialogs(294).Show() : this.ExecuteScript("WebPageCode", FunctionString);
    }


    /*ExecuteScript�ɽ�ͬ������ת��Ϊ�첽�������FireFox��Chrome��������е��������ʱ��������µ�������Ӧ��ʾ������⡣*/
    this.ExecuteScript = function (mValue, StringObject) {
        this.obj.ExecuteScript(mValue, StringObject);
    }

    /*����2015������*/
    this.ShowTitleBar = function (mValue) {
        var style = this.obj.Style;
        style.ShowTitleBar = mValue;
    }

    /*����2015�˵���*/
    this.ShowMenuBar = function (mValue) {
        var style = this.obj.Style;
        style.ShowMenuBar = mValue;
    }

    /*����Office������*/
    this.ShowToolBars = function (mValue) {
    	var style = this.obj.Style;
        style.ShowToolBars = mValue;
    }

    /*����2015״̬��*/
    this.ShowStatusBar = function (mValue) {
        var style = this.obj.Style;
        style.ShowStatusBar = mValue;
    }

    /*����2015ȫ��*/
    this.FullSize = function (mValue) {
    	this.obj.FullSize = mValue;
    }

    /*
    * ��ʾ�����غۼ�
    * ���غۼ�ʱ֮ǰ�ĺۼ�����Ӱ��
    */
    this.WebShow = function (blnValue) {
        if (this.getDocType(this.FileType) == this.DocType.WOED) {
            this.VBAShowRevisions(blnValue);
        }
    }

    //�Ƿ�����iWebOffice�������ĵ��ı��湦��
    this.SaveEnabled = function (mBoolean) {
        this.obj.SaveEnabled = mBoolean;
    }

    //�Ƿ�����iWebOffice�������ĵ��Ĵ�ӡ����
    this.PrintEnabled = function (mBoolean) {
        this.obj.PrintEnabled = mBoolean;
    }

    /*���ñ����ĵ�*/
    this.WebSetProtect = function (Boolean, password) {
        var docType = this.getDocType(this.FileType);
        if (password == "") {
            password = "123456";
        }
        Boolean ? this.VBAProtectDocument(docType, password) : this.VBAUnProtectDocument(docType, password);
    }

    /*������ǩֲ*/
    this.WebSetBookmarks = function (vbmName, vbmValue) {
        this.VBASetBookmarks(vbmName, vbmValue);
    }
    //����ǩ����
    this.WebOpenBookMarks = function(){	
    	var FunctionString = "ActiveObject.ActiveDocument.Application.Dialogs(168).Show()";
    	this.blnIE()?this.obj.ActiveDocument.Application.Dialogs(168).Show():this.ExecuteScript("WebPageCode",FunctionString);
    }
    
  //��괦�����ǩ
    this.WebAddBookMarks = function(BMarksName,BMarksValue){
	     if(!this.obj.ActiveDocument.BookMarks.Exists(BMarksName)){//�ж��Ƿ���ڸ���ǩ 
		var BMVLength = BMarksValue.length;      
              this.obj.ActiveDocument.Application.Selection.TypeText(BMarksValue);//��������     
              this.obj.ActiveDocument.Application.Selection.MoveLeft(Unit = 1, Count = BMVLength);
              var StartR = this.obj.ActiveDocument.Application.Selection.Start;                
              var EndR = this.obj.ActiveDocument.Application.Selection.Start + BMVLength;
              this.obj.ActiveDocument.Range(Start = StartR, End = EndR).Select();
              this.obj.ActiveDocument.Bookmarks.Add(BMarksName);//�����ǩ
	     }
    }
    //��ǩ��λ
    this.WebFindBookMarks = function(BMarksName){
		var range = this.obj.Range;
		range = this.obj.ActiveDocument.Bookmarks(BMarksName).Range;
		range.Select();
    }
   //ɾ����ǩ
    this.WebDelBookMarks = function(BMarksName){
    	if(this.obj.ActiveDocument.BookMarks.Exists(BMarksName)){//�ж��Ƿ���ڸ���ǩ 
	    this.obj.ActiveDocument.Bookmarks(BMarksName).Delete();//ɾ����ǩ
       }
    }  
    
    /*��ȡ��ǰ�ĵ������ͣ��Ժ�׺��������*/
    this.WebGetDocSuffix = function () {
    	try{
        var docType = this.getDocType(this.FileType); //�ж����ĵ����Ǳ��
        var FileTypeValue = 0;  //�жϴ��ĵ���ֵ 0��doc��12��docx��51��xls��56��xlsx
        if (docType == this.DocType.WOED) {  //word ��ȡvbaֵ�ķ���
	    		this.Activate(true);
            FileTypeValue = this.obj.ActiveDocument.SaveFormat;
        }
        if (docType == this.DocType.EXECL) { //Execl ��ȡ����
            this.obj.ExitExcelEditMode(); // �˳���ǰ�༭ģʽ
            FileTypeValue = this.obj.ActiveDocument.FileFormat;
		    	    if(FileTypeValue <0){ //2003��֧�ָ�����
		    	    	FileTypeValue = 56;
        }
	    	}
        return this.DocSuffixType[FileTypeValue];
    	}catch(e){
    		return this.FileType;
    	}
    }
    //iWebOffice�򿪵��ĵ�ȫ·����
    this.WebFullName = function () {
        return this.obj.FullName;
    }


    this.BookMark = "";
    this.ImageName = "";
    this.WebInsertImage = function (BookMark, ImageName) {//����Զ��ͼƬ��BookMark�������ǩ��λ��;ImageNameԶ��ͼƬ������
        var httpclient = this.obj.Http;
        this.sendMode = "LoadImage";
        this.BookMark = BookMark;
        this.ImageName = ImageName;
        var URL = this.WebUrl.substring(0, this.WebUrl.lastIndexOf("/"));
		httpclient.ShowProgressUI = false;//���ؽ�����
        if (httpclient.Open(this.HttpMethod.Post, URL + "/Document/" + ImageName, true)) {
            httpclient.Send();
		    httpclient.Clear();
        }
    }

    //������ǩ����ͼƬ
    this.InsertImageByBookMark = function () {
        if (this.BookMark == null || this.BookMark == 'null' || this.BookMark == "") {
            this.obj.ActiveDocument.Application.Selection.GoTo(-1, 0, 0, this.BookMark);
        }
        this.obj.ActiveDocument.Application.Selection.InlineShapes.AddPicture(this.FilePath + this.ImageName);
        this.obj.ActiveDocument.InlineShapes.Item(1).ConvertToShape();   //תΪ������
        this.obj.ActiveDocument.Shapes.Item(1).WrapFormat.Type = 5;     //0:������  1��������  2����Խ�ͻ��� 3�����������Ϸ� 4�������ͻ��� 5�����������·�  6�����������Ϸ�
        return true;
    }

    //�����ĵ����Ʋ����ĵ�
    this.WebInsertFile = function () {
        var httpclient = this.obj.Http; //����http����
        this.WebSetMsgByName("FILENAME", this.FileName); //����FileName
        this.WebSetMsgByName("OPTION", "LOADFILE");     //��������LOADFILE
        httpclient.AddForm("FormData", this.WebSendMessage()); //�������Զ���json �����ʽ��
        this.WebClearMessage();                         //�������WebSetMsgByName����
        if (this.LOADFILE(httpclient)) {                //Http���ط������ļ�   
            this.Status = "���ĵ��ɹ�";               //Status��״̬��Ϣ 
            return true;
        }
        this.Status = "���ĵ�ʧ��";               //Status��״̬��Ϣ 
        return false;


    }

    //�����ĵ�
    this.DownloadToFile = function (DownFileName, SavePath) {
        var httpclient = this.obj.Http;
        var URL = this.WebUrl.substring(0, this.WebUrl.lastIndexOf("/"));
        httpclient.ShowProgressUI = false;//���ؽ�����
        if (httpclient.Open(this.HttpMethod.Get, URL + "/Document/" + DownFileName, false)) {//ָ������ģ�������
            if (httpclient.Send()) {
                if (httpclient.Status == 200) {
                    httpclient.ResponseSaveToFile(SavePath + DownFileName);
                    httpclient.Clear();
                    return true;
                }
            }
        }
        httpclient.Close();
        return false;
    }


    /**
    ������������������������������������������������������������������������������������������������������
    * ��������
    * ������������������������������������������������������������������������������������������������������
    */
    /*�����洢Http���͵ı�����*/
    this.ArrayList = function () {
        this.ObjArr = {}; //�б�
        this.Count = 0; // ����
        this.Add = function (key, value) {//���
            this.ObjArr[key] = value;
            this.Count++;
            return true;
        }
        this.Clear = function () {//���
            this.ObjArr = {}; this.Count = 0;
        }
        //��json��ʽ���
        this.toString = function () {
            var newArray = new Array(); //�洢json�ַ���
            var i = 0; for (var i in this.ObjArr) {
                newArray.push("'" + i + "':'" + this.ObjArr[i] + "'");
            }
            return "{" + newArray + "}";
        }
    }
    this.ht = new this.ArrayList();
    /**
    * @deprecated:������Ӧ�ֶ���ֵ���ȴ����͸�������
    * @param FieldName
    * @param FieldValue
    * @return
    */
    this.WebSetMsgByName = function (FieldName, FieldValue) {
        this.ht.Add(FieldName, FieldValue);
    }

    /*��json��ʽ��������*/
    this.WebSendMessage = function () {
        return this.ht.toString();
    }
    /*@deprecated:�����WebSetMsgByName���õ�ֵ*/
    this.WebClearMessage = function () {
        this.ht.Clear();
    }


    /*�ж����������*/
    this.blnIE = function () {
        return (window.ActiveXObject != undefined) || (window.ActiveXObject != null) || ("ActiveXObject" in window)
    }
     /*�ж��Ƿ���WPS*/
     this.isWPS = function(){
    	 return this.FileType.toUpperCase()  == ".WPS" || this.FileType.toUpperCase()  == ".ET";
     }
    /*
    * �ؼ��汾
    */
    this.Version = function () {
        return this.obj.Version;
    }

    //�Ƿ�����iWebOffice�����ڵĿ������ܡ��ǿؼ��Ĳ���Ӱ��
    this.WebEnableCopy = function (mValue) {
        switch (mValue) {
            case 0:
            case false:
            case "0": this.obj.CopyEnabled = false; break; //����
            case 1:
            case "1":
            case true: this.obj.CopyEnabled = true; break; //�ر�
            default: ; return;
        }
    }

    //ɾ���ļ�
    this.WebDelFile = function (FileName) {
        var fs = this.obj.FileSystem;
        fs.DeleteFile(FileName);
    }

    //����״̬
    this.setEditType = function (type) {
    	try{
        switch (type) {
            case "0": this.VBAProtectDocument(this.getDocType(this.FileType), "123"); break;
            case "1": this.WebShow(false); break;
            case "2": this.WebShow(true); break;
            default: ;
        }
    	}catch(e){
  			return false;
    }
     }
    /**
    ������������������������������������������������������������������������������������������������������
    * End ��������
    * ������������������������������������������������������������������������������������������������������
    */




    /**
    ������������������������������������������������������������������������������������������������������
    * VBAר��
    * ������������������������������������������������������������������������������������������������������
    */
    //��ʾ�ۼ������غۼ�
    this.VBAShowRevisions = function (mValue) {
    	if(this.getDocType(this.FileType)== this.DocType.WOED && this.obj.ActiveDocument.ProtectionType == "-1"){
        this.obj.ActiveDocument.TrackRevisions = mValue; //��ʾ��Ǻ����ر��
        this.obj.ActiveDocument.ShowRevisions = mValue; //��ʾ�ۼ�������
	    	return true;
    }
    	return false;
     } 
    //�����ĵ������ĵ�
    this.VBAProtectDocument = function (docType, password) {
        if (docType == this.DocType.WOED) {//word ����ģʽ
    		 if(this.obj.ActiveDocument.ProtectionType == "-1"){
            this.obj.ActiveDocument.Protect(3, false, password);
            return;
        }
    	 }
        if (docType == this.DocType.EXECL) {//word ����ģʽ������ֻ������1�������İ��Լ������д
    		 if(!this.obj.ActiveDocument.Application.Sheets(1).ProtectContents){ //�жϱ��Ƿ��Ǳ�����
            this.obj.ActiveDocument.Application.Sheets(1).Protect(password);
    		 }
            return;
        }
    	 return false
    }

    //��������������
    this.VBAUnProtectDocument = function (docType, password) {
        if (docType == this.DocType.WOED) {//word ����ģʽ
            this.obj.ActiveDocument.Unprotect(password); ;
            return;
        }

        if (docType == this.DocType.EXECL) {//word ����ģʽ������ֻ������1�������İ��Լ������д
            this.obj.ActiveDocument.Application.Sheets(1).Unprotect(password);
            return;
        }
    }


    //������ǩ
    this.VBASetBookmarks = function (vbmName, vbmValue) {
    	 try{
        this.obj.ActiveDocument.Bookmarks(BookMarkName).Range.Text = BookMarkValue;
    	 }catch(e){
    		 return false;
    }
     }
    this.VBAInsertFile = function (Position, FileName) {
        try {
            this.obj.ActiveDocument.Application.Selection.GoTo(-1, 0, 0, Position);
            this.obj.Activate(true);
            this.obj.ActiveDocument.Application.Selection.InsertFile(FileName, "", false, false, false);
            return true;
        } catch (e) {
            return false;
        }
    }

    //�������кۼ�	
    this.WebAcceptAllRevisions = function () {
        try {
            this.obj.Activate(true);
            this.obj.ActiveDocument.Revisions.AcceptAll();
            return this.obj.ActiveDocument.Revisions.Count >= 0 ? true : false;
        } catch (e) {
            return false;
        }
    }
    //����WORD�û���
    this.VBASetUserName = function (UserName) {
    	 try{
        this.obj.ActiveDocument.Application.UserName = UserName;
    	 }catch(e){
    		 return false;
    }
     }
     //������
     this.ShowField  = function(){
    	try{ 
    	 this.obj.ActiveDocument.ActiveWindow.View.ShowDrawings = true;
    	 this.obj.ActiveDocument.ActiveWindow.View.ShowFieldCodes = true;
    	}catch(e){
    		return false;
    	}
     }
     
     //���򱣻�
     this.WebAreaProtect = function(BMarksName){
	    if(!this.obj.ActiveDocument.BookMarks.Exists(BMarksName)){//�ж��Ƿ���ڸ���ǩ 
	    	alert("�ļ���û������Ϊ'"+BMarksName+"'����ǩ ,���������ǩ!");
	    	return;
		}
    	var range = this.obj.Range;
    	range = this.obj.ActiveDocument.Bookmarks(BMarksName).Range;
    	range.Select();
    	this.obj.ActiveDocument.bookmarks(BMarksName).range.editors.add(-1); //������wdeditoreveryone=-1 
    	this.obj.ActiveDocument.Protect(3,false,"123",false,false);//������wdAllowOnlyReading=3		
    	this.obj.ActiveDocument.Application.Selection.MoveLeft(Unit = 1, Count = 1);	
    	this.obj.ActiveDocument.ActiveWindow.View.ShadeEditableRanges = false;//ȡ��"ͻ����ʾ�ɱ༭����"	
        }
     //ȡ�����򱣻�
     this.WebAreaUnprotect = function(BMarksName){
	 	if(this.obj.ActiveDocument.BookMarks.Exists(BMarksName)){//�ж��Ƿ���ڸ���ǩ
	 	try{
	 		this.obj.ActiveDocument.Unprotect("123");//�Ᵽ��
	 		var range = this.obj.Range;
	 		range = this.obj.ActiveDocument.Bookmarks(BMarksName).Range;
	 		range.Select();//ѡ����ǩ����					
	 		this.obj.ActiveDocument.DeleteAllEditableRanges(-1); //ȥ��ͻ����ʾ		 
	 	 }catch(e){ 
	 	 }
	 	}else{
	 		alert("�����ڸ���ǩ!");
	 		return;
	 	}
     }
     
  
    /**
    ������������������������������������������������������������������������������������������������������
    * End VBAר��
    * ������������������������������������������������������������������������������������������������������
    */



    /**
    ������������������������������������������������������������������������������������������������������
    * Ƥ��
    * ������������������������������������������������������������������������������������������������������
    */
    this.Skin = function (typeColor) {//���ñ߿����ʾ��ʹ��iWebOffice���ÿ�
        switch (typeColor) {
            case "purple": this.setColor("purple"); this.Status = ("set pink success"); break;
            case "black": this.setColor("black"); this.Status = ("set black success"); break;
            case "white": this.setColor("white"); this.Status = ("set black success"); break;
            case "blue": this.setColor("blue"); this.Status = ("set black success"); break;
            case "yellow": this.setColor("yellow"); this.Status = ("set black success"); break;
        }

    }
    this.setColor = function (typeColor) {   //���ñ߿���ʾ
    	var titleBarColor;
        var menuBarStartColor;
        var menuBarButtonStartColor;
        var menuBarButtonEndColor;
        var menuBarButtonFrameColor;
        var CustomToolbarStartColor;
        switch (typeColor) {
            case "purple": titleBarColor = 0xCC99CC; CustomToolbarStartColor = 0xCC99CC;menuBarStartColor = 0xCC99CC; menuBarButtonStartColor = 0xFFFFFF; menuBarButtonEndColor = 0xAD8DAD; menuBarButtonFrameColor = 0x663366; break;
            case "black": titleBarColor = 0x646464; CustomToolbarStartColor = 0x646464;menuBarStartColor = 0xB7B5B4; menuBarButtonStartColor = 0xF2EAF5; menuBarButtonEndColor = 0xF2EAF5; menuBarButtonFrameColor = 0xF2EAF5; break;
            case "white": titleBarColor = 0xC6C1BE; CustomToolbarStartColor = 0xC6C1BE;menuBarStartColor = 0xF5F3F2; menuBarButtonStartColor = 0xF2EAF5; menuBarButtonEndColor = 0xF2EAF5; menuBarButtonFrameColor = 0xF2EAF5; break;
            case "blue": titleBarColor = 0xD5B69F; CustomToolbarStartColor = 0xD5B69F;menuBarStartColor = 0xFCF3EF; menuBarButtonStartColor = 0xF2EAF5; menuBarButtonEndColor = 0xF2EAF5; menuBarButtonFrameColor = 0xF2EAF5; break;
            case "yellow": titleBarColor = 0x00CCFF; CustomToolbarStartColor = 0x00CCFF;menuBarStartColor = 0x6AB9FF; menuBarButtonStartColor = 0xF2EAF5; menuBarButtonEndColor = 0xF2EAF5; menuBarButtonFrameColor = 0xF2EAF5; break;
        }
        var style = this.obj.Style;
        style.TitleBarColor = titleBarColor;
        style.TitleBarTextColor = 0x000000;
        style.MenuBarStartColor = menuBarStartColor;
        style.MenuBarEndColor = 0xFFFFFF;
        style.MenuBarTextColor = 0x000000;
        style.MenuBarHighlightTextColor = 0x000000;
        style.MenuBarButtonStartColor = menuBarButtonStartColor;
        style.MenuBarButtonEndColor = menuBarButtonEndColor;
        style.MenuBarButtonFrameColor = menuBarButtonFrameColor;
        style.CustomToolbarStartColor=CustomToolbarStartColor;
        style.Invalidate();
    }
    /**
    ������������������������������������������������������������������������������������������������������
    * End Ƥ��
    * ������������������������������������������������������������������������������������������������������
    */
    
    
    /**
    ������������������������������������������������������������������������������������������������������
    * ��дǩ������
    * ������������������������������������������������������������������������������������������������������
    */
    //�����дǩ��������
    this.AddToolbar=function() {
    	//this.obj.Style.ShowCustomToolbar=true;
    	this.obj.Handwritting.Show = !this.obj.Handwritting.Show;    	
    	var URL = this.WebUrl.substring(0, this.WebUrl.lastIndexOf("/"));
	    var customtoolbar = this.obj.CustomToolbar;
		customtoolbar.AddToolButton(301,"��дǩ��",URL+"/HandWrite/"+"shouxie24.png", "��дǩ��",0);
		customtoolbar.AddToolButton(302,"ֹͣ��д",URL+"/HandWrite/"+"tingzhi24.png","ֹͣ��д",0);
		customtoolbar.AddToolButton(303,"����ǩ��",URL+"/HandWrite/"+"wenzi24.png","����ǩ��",0);
		customtoolbar.AddToolButton(300,"-","","",1);
		customtoolbar.AddToolButton(304,"ͼ��ǩ��",URL+"/HandWrite/"+"tuxing24.png","ͼ��ǩ��",0);
		customtoolbar.AddToolButton(305,"ȡ����һ��ǩ��",URL+"/HandWrite/"+"quxiao24.png","ȡ����һ��ǩ��",0);
		customtoolbar.AddToolButton(306,"��ʾ�û�ǩ��",URL+"/HandWrite/"+"xianshi24.png","��ʾ�û�ǩ��",0);
	}
    
  //��дǩ��
    this.HandWriting = function(penColor,penWidth){
    	var handwritting = this.obj.Handwritting;
		var handsetting = handwritting.DrawingSetting;
		handsetting.PenThicker = penWidth;
		handsetting.PenColor = penColor;
		handwritting.AnnotateDraw();
		this.ShowMenuBar(false);//ǩ��ʱ���ز˵���
		this.ShowToolBars(false);//ǩ��ʱ���ع�����
		
		
    }
    //ֹͣ��дǩ��
    this.StopHandWriting = function(){
    	var handwritting = this.obj.Handwritting;
		handwritting.StopAnnotate();
		WebOffice.ShowMenuBar(true);//ֹͣǩ��ʱ��ʾ�˵���
		WebOffice.ShowToolBars(true);//ֹͣǩ��ʱ��ʾ������
    }
    //����ǩ��
    this.TextWriting = function(){
    	var handwritting = this.obj.Handwritting;
		var textsetting = handwritting.TextSetting;
		textsetting.TextSize = 32;
		textsetting.TextColor = 0xbb00ff;
		textsetting.FontName = "����";
		handwritting.AnnotateText();
		this.ShowMenuBar(false);//ǩ��ʱ���ز˵���
		this.ShowToolBars(false);//ǩ��ʱ���ع�����
		
    }
    //ͼ��ǩ��
    this.ShapeWriting = function(){
    	var handwritting = this.obj.Handwritting;
		var shapesetting = handwritting.ShapeSetting;
		shapesetting.ShapeType = 0;
		shapesetting.BackgroundColor = 0xffffff;
		shapesetting.BorderColor = 0xff0000;
		shapesetting.BorderWidth = 6;		
		handwritting.AnnotateShape();
		this.ShowMenuBar(false);//ǩ��ʱ���ز˵���
		this.ShowToolBars(false);//ǩ��ʱ���ع�����
    }
    //ȡ����һ��ǩ��
    this.RemoveLastWriting = function(){
    	var handwritting = this.obj.Handwritting;
		handwritting.RemoveLast();
    }
    //��ʾĳ�û���ǩ��
    this.ShowWritingUser = function(bVal,username){
    	var strxml = this.obj.GetAnnotations();
    	var json = eval('(' + strxml + ')');
		if (username != "" && username != null && username!=undefined) {
			for(var i=0;i<json.Annotations.length;i++)
			{   
				if(json.Annotations[i].Annotation.User != username) {
					var id = json.Annotations[i].Annotation.ID; 
					this.obj.GetAnnotationByID(id).Visible = bVal;
				}
			}
		}else {
			for(var i=0;i<json.Annotations.length;i++)
			{   
				var id = json.Annotations[i].Annotation.ID; 
				this.obj.GetAnnotationByID(id).Visible = bVal;
			}
		}
    }
    //��ʾ/������дǩ��������
    this.ShowCustomToolbar = function(bVal){
    	this.obj.Style.ShowCustomToolbar=bVal;
    	//if(bVal==true) this.obj.Style.CustomToolbarStartColor=0xDDA0DD; //����ǩ����������ɫ
    }
    /**
    ������������������������������������������������������������������������������������������������������
    * ��дǩ������
    * ������������������������������������������������������������������������������������������������������
    */
    
    /**
    ������������������������������������������������������������������������������������������������������
    * ��չ����
    * ������������������������������������������������������������������������������������������������������
    */
    //����ΪPDF
    this.WebSavePDF = function(){
    	var httpclient = this.obj.Http; //����http����
        httpclient.Clear();
	   	this.WebSetMsgByName("RECORDID",this.RecordID);
	   	this.WebSetMsgByName("OPTION","SAVEPDF");
	   	this.WebSetMsgByName("FILENAME",this.RecordID + ".pdf");//����FileName
	   	this.SaveAsPdf(this.getFilePath()+this.RecordID + ".pdf");
	   	if(this.SAVEFILE(httpclient,this.getFilePath()+this.RecordID + ".pdf")){
   		 this.Status = "�����ļ��ɹ�";
   		 alert("����PDF�ɹ�!");
   		 return true;
	   	}
   	 this.Status = "�����ļ�ʧ��";
   	 return false;
   }
    
    this.SaveAsPdf = function(FilePath){
    	//var FilePath=this.getFilePath() + this.RecordID + ".pdf";
    	if ((this.FileType  == ".doc") || (this.FileType  == ".docx") || (this.FileType  == ".wps"))
		  {		
		  		try 
				{
		  			
		  			this.obj.ActiveDocument.ExportAsFixedFormat(FilePath, 17, false, 0, 0, 1, 1, 0, true, true, 0, true, true, true);
				} 
				catch (e) 
				{
					return this.e.description;
		  		}
				return true;
		  	}
	  }

    //����Ϊhtml
    this.SaveAsHtml = function(FilePath){
    	if ((this.FileType  == ".doc") || (this.FileType  == ".docx") || (this.FileType  == ".wps"))
  	  {
  	  		try 
  			{
  	  			var ret = this.obj.ActiveDocument.SaveAs(FilePath,8,false,"",false,"",false,false,false,false,false,0);
  			   this.obj.ActiveDocument.Application.ActiveWindow.View.type = 3;//3��ҳ����ͼ
  			} 
  			catch (e) 
  			{
  	  	
  				return this.e.description;
  	  		}
  	  		return true;;
  	  	}
    }
    this.WebSaveHtml = function(){
	  if(this.SaveAsHtml("D:\\"+this.RecordID + ".html"))
	  {
		  alert("����Html�ɹ�!\n����·��:  "+"D:\\"+this.RecordID + ".html");
	  }
    }
	//ִ�к�
    this.WebRunMacro = function(MarcroName,MacroValue){	
    	try{	
    		   var VBAStr =  MacroValue;    	 
    		   var VBCom;
    		   VBCom = this.obj.ActiveDocument.VBProject.VBComponents.Add(1);
    		   VBCom.CodeModule.AddFromString(VBAStr);  
    		   this.obj.ActiveDocument.Application.Run(MarcroName);
    		   return true;
    	     	}catch(e){
    	     		return false;
    	     	}
     }
    /**
    ������������������������������������������������������������������������������������������������������
    * ��չ����
    * ������������������������������������������������������������������������������������������������������
    */
}