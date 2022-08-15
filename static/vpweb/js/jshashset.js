/**  
 * FastMap��������������java�е�Map�Ľű�����������FastMap�Ĺ��캯��  
 */  
var FastMap = function() {   
    this.version = '1.0';       //�汾��ʶ   
    this.buf = new Object();    //����Key��Value�Ķ���   
}   
  
/**  
 * FastMap���෽�����ṩ������Map��add��get��remove�������ṩ��cut������  
 */  
FastMap.prototype = {   
    /**  
     * ��Ӽ�ֵ��  
     *   
     * @param {String} sKey ��  
     * @param {Object} oValue ֵ  
     */  
    add: function(sKey, oValue) {   
        this.buf[sKey] = oValue;   
    },   
  
    /**  
     * ͨ����ȡ��ֵ  
     *   
     * @param {Object} sKey ��  
     */  
    get: function(sKey) {   
        return this.buf[sKey];   
    },   
       
    /**  
     * �Ƴ�sKey����Ӧ������  
     *   
     * @param {String} sKey  
     */  
    remove: function(sKey) {   
        delete (this.buf[sKey]);   
    },   
       
    /**  
     * ����sKey��Ӧ�Ķ�����Ƴ�sKey����  
     *   
     * @param {Object} sKey  
     */  
    cut: function(sKey) {   
        var buf = this.buf;   
        var result = buf[sKey];   
        delete buf[sKey];   
        return result;   
    },   
       
    /**  
     * ����Map�еĻ������  
     * �õ�����������for(var ele in buf){ someCode }ȥѭ���������ԣ���������_hashCode���ԣ�Ҫע�⣡  
     */  
    getBuf: function(){   
        return this.buf;   
    },   
       
    /**  
     * �õ�buf�еĶ�����Ŀ  
     */  
    size: function() {   
        var buf = this.buf;   
        var i = -1;     //��_hashCode���ԣ����Դ�-1��ʼ   
        for(var ele in buf) {   
            i ++;   
        }   
        return i;   
    },   
       
    /**  
     * toString����  
     */  
    toString: function() {   
        var b = this.buf;   
        var buf = [];   
        for(var ele in b) {   
            buf.push('Key: ');   
            buf.push(ele);   
            buf.push('  Value: ');   
            buf.push(b[ele]);   
            buf.push('\n');   
        }   
        return buf.join('');   
    }   
}  
