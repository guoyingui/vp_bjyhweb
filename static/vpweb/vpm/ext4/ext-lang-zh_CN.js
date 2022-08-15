/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * Simplified Chinese translation
 * By DavidHu
 * 09 April 2007
 * 
 * update by andy_ghg
 * 2009-10-22 15:00:57
 */
Ext.onReady(function(){
    if(Ext.Updater){
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">������...</div>';
    }

    if(Ext.view.View){
       Ext.view.View.prototype.emptyText = "";
    }

    if(Ext.grid.Panel){
       Ext.grid.Panel.prototype.ddText = "ѡ���� {0} ��";
    }

    if(Ext.TabPanelItem){
       Ext.TabPanelItem.prototype.closeText = "�رմ˱�ǩ";
    }

    if(Ext.form.field.Base){
       Ext.form.field.Base.prototype.invalidText = "����ֵ�Ƿ�";
    }

    if (Ext.LoadMask) {
        Ext.LoadMask.prototype.msg = "��ȡ��...";
    }

    if(Ext.Date){
        Ext.Date.monthNames = [
           "һ��",
           "����",
           "����",
           "����",
           "����",
           "����",
           "����",
           "����",
           "����",
           "ʮ��",
           "ʮһ��",
           "ʮ����"
        ];

        Ext.Date.dayNames = [
           "��",
           "һ",
           "��",
           "��",
           "��",
           "��",
           "��"
        ];

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? '����' : '����')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? '����' : '����')";
    }

    if(Ext.MessageBox){
       Ext.MessageBox.buttonText = {
          ok     : "ȷ��",
          cancel : "ȡ��",
          yes    : "��",
          no     : "��"
       };
    }

    if(Ext.util.Format){
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u00a5',  // Chinese Yuan
            dateFormat: 'y��m��d��'
        });
    }

    if(Ext.picker.Date){
       Ext.apply(Ext.picker.Date.prototype, {
          todayText         : "����",
          minText           : "���ڱ��������С��������",//update
          maxText           : "���ڱ���С�������������",//update
          disabledDaysText  : "",
          disabledDatesText : "",
          monthNames        : Ext.Date.monthNames,
          dayNames          : Ext.Date.dayNames,
          nextText          : '�¸��� (Ctrl+Right)',
          prevText          : '�ϸ��� (Ctrl+Left)',
          monthYearText     : 'ѡ��һ���� (Control+Up/Down ���ı����)',//update
          todayTip          : "{0} (�ո��ѡ��)",
          format            : "y��m��d��"
       });
    }

    if(Ext.picker.Month) {
      Ext.apply(Ext.picker.Month.prototype, {
          okText            : "ȷ��",
          cancelText        : "ȡ��"
      });
    }

    if(Ext.toolbar.Paging){
       Ext.apply(Ext.PagingToolbar.prototype, {
          beforePageText : "��",//update
          afterPageText  : "ҳ,�� {0} ҳ",//update
          firstText      : "��һҳ",
          prevText       : "��һҳ",//update
          nextText       : "��һҳ",
          lastText       : "���ҳ",
          refreshText    : "ˢ��",
          displayMsg     : "��ʾ {0} - {1}������ {2} ��",//update
          emptyMsg       : 'û������'
       });
    }

    if(Ext.form.field.Text){
       Ext.apply(Ext.form.field.Text.prototype, {
          minLengthText : "�����������С������ {0} ���ַ�",
          maxLengthText : "�����������󳤶��� {0} ���ַ�",
          blankText     : "��������Ϊ������",
          regexText     : "",
          emptyText     : null
       });
    }



if(Ext.tree.plugin.TreeViewDragDrop){
       Ext.apply(Ext.tree.plugin.TreeViewDragDrop.prototype, {
          dragText:'{0} ѡ�еĽڵ�{1}'
       });
    }





    if(Ext.form.field.Number){
       Ext.apply(Ext.form.field.Number.prototype, {
          minText : "�����������Сֵ�� {0}",
          maxText : "������������ֵ�� {0}",
          nanText : "{0} ������Ч��ֵ",
          negativeText : 'ֵ����Ϊ����'
       });
    }

    if(Ext.form.field.Date){
       Ext.apply(Ext.form.field.Date.prototype, {
          disabledDaysText  : "����",
          disabledDatesText : "����",
          minText           : "������������ڱ����� {0} ֮��",
          maxText           : "������������ڱ����� {0} ֮ǰ",
          invalidText       : "{0} ����Ч������ - ������ϸ�ʽ�� {1}",
          format            : "y��m��d��"
       });
    }

    if(Ext.form.field.ComboBox){
       Ext.apply(Ext.form.field.ComboBox.prototype, {
          valueNotFoundText : undefined
       });
        Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
            loadingText       : "������..."
        });
    }

    if(Ext.form.field.VTypes){
       Ext.apply(Ext.form.field.VTypes, {
          emailText    : '������������ǵ����ʼ���ַ����ʽ�磺 "user@example.com"',
          urlText      : '�������������URL��ַ����ʽ�磺 "http:/'+'/www.example.com"',
          alphaText    : '��������ֻ�ܰ��������ĸ��_',//update
          alphanumText : '��������ֻ�ܰ��������ĸ,���ֺ�_'//update
       });
    }
    //add HTMLEditor's tips by andy_ghg
    if(Ext.form.field.HtmlEditor){
      Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        createLinkText : '��ӳ�������:',
        buttonTips : {
          bold : {
            title: '���� (Ctrl+B)',
            text: '��ѡ�е���������Ϊ����',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          italic : {
            title: 'б�� (Ctrl+I)',
            text: '��ѡ�е���������Ϊб��',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          underline : {
            title: '�»��� (Ctrl+U)',
            text: '����ѡ���ּ��»���',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          increasefontsize : {
            title: '��������',
            text: '�����ֺ�',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          decreasefontsize : {
            title: '��С����',
            text: '��С�ֺ�',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          backcolor : {
            title: '�Բ�ͬ��ɫͻ����ʾ�ı�',
            text: 'ʹ���ֿ���ȥ������ӫ������˱��һ��',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          forecolor : {
            title: '������ɫ',
            text: '����������ɫ',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          justifyleft : {
            title: '�����',
            text: '�����������',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          justifycenter : {
            title: '����',
            text: '�����־��ж���',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          justifyright : {
            title: '�Ҷ���',
            text: '�������Ҷ���',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          insertunorderedlist : {
            title: '��Ŀ����',
            text: '��ʼ������Ŀ�����б�',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          insertorderedlist : {
            title: '���',
            text: '��ʼ��������б�',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          createlink : {
            title: 'ת�ɳ�������',
            text: '����ѡ�ı�ת���ɳ�������',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          },
          sourceedit : {
            title: '������ͼ',
            text: '�Դ������ʽչ���ı�',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
          }
        }
      });
    }


    if(Ext.grid.header.Container){
       Ext.apply(Ext.grid.header.Container.prototype, {
          sortAscText  : "����",//update
          sortDescText : "����",//update
          lockText     : "������",//update
          unlockText   : "�������",//update
          columnsText  : "��"
       });
    }

    if(Ext.grid.PropertyColumnModel){
       Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
          nameText   : "����",
          valueText  : "ֵ",
          dateFormat : "y��m��d��"
       });
    }

    if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
       Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
          splitTip            : "�϶����ı�ߴ�.",
          collapsibleSplitTip : "�϶����ı�ߴ�. ˫������."
       });
    }
});
