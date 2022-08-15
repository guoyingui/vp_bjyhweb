var str = '';
var copyright = "金格科技iWebPlugin多浏览器插件[演示版];V5.0S0xGAAEAAAAAAAAAEAAAAG0BAABwAQAALAAAAOZpNnDAuUGBn4ugXMhvVdkb3Crr/BqkQ3104bnrgqyXllr9Yzon9FrX/xxky2DhO2CWjWTUs0W9NDTyPNpMj6WVXHzwijwHUvmmUw/r5NwtQOPMGVupCNc3oKiWjFztPiCuaoIHOdcaVxxotpzyP+2TG9QYTN6xAwGjTvnVi3WSt9v7lXM+ghB8PoPcEoDDDSk0ktDHE5p1MM8kfZqCF59ZWpPmXQqo0VdlIBglK4MjhR4cdfzywbyTqrzo2sWcX9n0SZmHlaRu3T8lRWvLMyYKdLyT6pk7wFHm8m/F7RXBiIIglu1b4PjFT2yHM4BeUDKttNgMSzFrmbsFhz01Jeiu1mqNI2xTP1+hq8zPj6cCVFNwull0MNMyOCWtrmCE/py5lJqKtpws7Ab/D0mzMofqe9PtHk8QSgDH4PoV1uAFka9K5q1LWZCkBLYHZw5jwvlCEHn0brPPEQQUnNdi7thLc1yxjsnf+n8980axiKLNf2PGMP30hkJmwEeijx2+yQ==";
str += '<div id="DivID">';
str += '<object id="WebPDF"';
str += ' width="100%"';
str += ' height="100%"';
if ((window.ActiveXObject!=undefined) || (window.ActiveXObject!=null) ||"ActiveXObject" in window)
{
	str += 'classid="clsid:39E08D82-C8AC-4934-BE07-F6E816FD47A1" codebase="iWebPDF.cab#version=8,2,0,1004" VIEWASTEXT';
	str += '>';
	str += '<param name="Copyright" value="' + copyright + '">';
}
else
{
	str += ' progid="iWebPDF.PDFReader"';
	str += ' type="application/iwebplugin"';
	str += ' OnCommand="OnCommand"';
	str += ' OnReady="OnReady"';
	str += ' OnOLECommand="OnOLECommand"';
	str += ' OnExecuteScripted="OnExecuteScripted"';
	str += ' OnQuit="OnQuit"';
	str += ' OnSendStart="OnSendStart"';
	str += ' OnSending="OnSending"';
	str += ' OnSendEnd="OnSendEnd"';
	str += ' OnRecvStart="OnRecvStart"';
	str += ' OnRecving="OnRecving"';
	str += ' OnRecvEnd="OnRecvEnd"';
	str += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
	str += ' OnFullSizeBefore="OnFullSizeBefore"';
	str += ' OnFullSizeAfter="OnFullSizeAfter"';	
	str += ' Copyright="' + copyright + '"';
	str += '>';
}
str += '</object>';
str += '</div>';
document.write(str);