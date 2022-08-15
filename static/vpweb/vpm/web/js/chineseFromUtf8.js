function   chineseFromUtf8Url(strUtf8){ 
	var   bstr   =   ""; 
	var   nOffset   =   0; //   processing   point   on   strUtf8 
   
	if(   strUtf8   ==   ""   ) 
      	return   ""; 
   
		//strUtf8   =   strUtf8.toLowerCase(); 
		strUtf8=strUtf8
		nOffset   =   strUtf8.indexOf("%E"); 
if(   nOffset   ==   -1   ) 
      return   strUtf8; 
       
while(   nOffset   !=   -1   ) 
{ 
       
      bstr   +=   strUtf8.substr(0,   nOffset); 
      strUtf8   =   strUtf8.substr(nOffset,   strUtf8.length   -   nOffset); 
      if(   strUtf8   ==   ""   ||   strUtf8.length   <   9   )       //   bad   string 
          return   bstr; 
       
      bstr   +=   utf8CodeToChineseChar(strUtf8.substr(0,   9)); 
      strUtf8   =   strUtf8.substr(9,   strUtf8.length   -   9); 
      nOffset   =   strUtf8.indexOf("%E"); 
} 
   
return   bstr   +   strUtf8; 
} 
   
function   unicodeFromUtf8(strUtf8){ 
var   bstr   =   ""; 
var   nTotalChars   =   strUtf8.length; //   total   chars   to   be   processed. 
var   nOffset   =   0; //   processing   point   on   strUtf8 
var   nRemainingBytes   =   nTotalChars; //   how   many   bytes   left   to   be   converted 
var   nOutputPosition   =   0; 
var   iCode,   iCode1,   iCode2; //   the   value   of   the   unicode. 
   
while   (nOffset   <   nTotalChars) 
{ 
iCode   =   strUtf8.charCodeAt(nOffset); 
if   ((iCode   &   0x80)   ==   0) //   1   byte. 
{ 
if   (   nRemainingBytes   <   1   ) //   not   enough   data 
break; 
   
bstr   +=   String.fromCharCode(iCode   &   0x7F); 
nOffset   ++; 
nRemainingBytes   -=   1; 
} 
else   if   ((iCode   &   0xE0)   ==   0xC0) //   2   bytes 
{ 
iCode1   =     strUtf8.charCodeAt(nOffset   +   1); 
if   (   nRemainingBytes   <   2   || //   not   enough   data 
    (iCode1   &   0xC0)   !=   0x80   ) //   invalid   pattern 
{ 
break; 
} 
   
bstr   +=   String.fromCharCode(((iCode   &   0x3F)   <<   6)   |   (   iCode1   &   0x3F)); 
nOffset   +=   2; 
nRemainingBytes   -=   2; 
} 
else   if   ((iCode   &   0xF0)   ==   0xE0) //   3   bytes 
{ 
iCode1   =     strUtf8.charCodeAt(nOffset   +   1); 
iCode2   =     strUtf8.charCodeAt(nOffset   +   2); 
if   (   nRemainingBytes   <   3   || //   not   enough   data 
    (iCode1   &   0xC0)   !=   0x80   || //   invalid   pattern 
    (iCode2   &   0xC0)   !=   0x80   ) 
{ 
break; 
} 
   
bstr   +=   String.fromCharCode(((iCode   &   0x0F)   <<   12)   |    
((iCode1   &   0x3F)   <<     6)   | 
(iCode2   &   0x3F)); 
nOffset   +=   3; 
nRemainingBytes   -=   3; 
} 
else //   4   or   more   bytes   --   unsupported 
break; 
} 
   
if   (nRemainingBytes   !=   0) 
{ 
//   bad   UTF8   string. 
return   ""; 
} 
   
   
return   bstr; 

} 
   
function   utf8CodeToChineseChar(strUtf8) 
{ 
      var   iCode,   iCode1,   iCode2; 
      iCode   =   parseInt("0x"   +   strUtf8.substr(1,   2)); 
      iCode1   =   parseInt("0x"   +   strUtf8.substr(4,   2)); 
      iCode2   =   parseInt("0x"   +   strUtf8.substr(7,   2)); 
      //alert(strUtf8+"  "+iCode+"  "+iCode1+"  "+iCode2); 
       
      return   String.fromCharCode(((iCode   &   0x0F)   <<   12)   |    
((iCode1   &   0x3F)   <<     6)   | 
(iCode2   &   0x3F)); 
} 