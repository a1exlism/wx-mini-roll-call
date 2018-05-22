const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day,].map(formatNumber).join('/') + ' ' + [hour, minute, second,].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1]
		? n
		: '0' + n
}

//  Refer: http://www.css88.com/archives/7340

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
 const accAdd = (arg1, arg2) => {
     var r1, r2, m, c;
     try {
         r1 = arg1.toString().split(".")[1].length;
     }
     catch (e) {
         r1 = 0;
     }
     try {
         r2 = arg2.toString().split(".")[1].length;
     }
     catch (e) {
         r2 = 0;
     }
     c = Math.abs(r1 - r2);
     m = Math.pow(10, Math.max(r1, r2));
     if (c > 0) {
         var cm = Math.pow(10, c);
         if (r1 > r2) {
             arg1 = Number(arg1.toString().replace(".", ""));
             arg2 = Number(arg2.toString().replace(".", "")) * cm;
         } else {
             arg1 = Number(arg1.toString().replace(".", "")) * cm;
             arg2 = Number(arg2.toString().replace(".", ""));
         }
     } else {
         arg1 = Number(arg1.toString().replace(".", ""));
         arg2 = Number(arg2.toString().replace(".", ""));
     }
     return (arg1 + arg2) / m;
 }

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
const accSub = (arg1, arg2) => {
     var r1, r2, m, n;
     try {
         r1 = arg1.toString().split(".")[1].length;
     }
     catch (e) {
         r1 = 0;
     }
     try {
         r2 = arg2.toString().split(".")[1].length;
     }
     catch (e) {
         r2 = 0;
     }
     m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
     n = (r1 >= r2) ? r1 : r2;
     return ((arg1 * m - arg2 * m) / m).toFixed(n);
 }

/**
 * Base64 Object
 * @function encode[plain]
 * @function decode[encrypted]
 * Refer: https://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
 */
 // Create Base64 Object
 const Base64 = {


     _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


     encode: function(input) {
         var output = "";
         var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
         var i = 0;

         input = Base64._utf8_encode(input);

         while (i < input.length) {

             chr1 = input.charCodeAt(i++);
             chr2 = input.charCodeAt(i++);
             chr3 = input.charCodeAt(i++);

             enc1 = chr1 >> 2;
             enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
             enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
             enc4 = chr3 & 63;

             if (isNaN(chr2)) {
                 enc3 = enc4 = 64;
             } else if (isNaN(chr3)) {
                 enc4 = 64;
             }

             output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

         }

         return output;
     },


     decode: function(input) {
         var output = "";
         var chr1, chr2, chr3;
         var enc1, enc2, enc3, enc4;
         var i = 0;

         input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

         while (i < input.length) {

             enc1 = this._keyStr.indexOf(input.charAt(i++));
             enc2 = this._keyStr.indexOf(input.charAt(i++));
             enc3 = this._keyStr.indexOf(input.charAt(i++));
             enc4 = this._keyStr.indexOf(input.charAt(i++));

             chr1 = (enc1 << 2) | (enc2 >> 4);
             chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
             chr3 = ((enc3 & 3) << 6) | enc4;

             output = output + String.fromCharCode(chr1);

             if (enc3 != 64) {
                 output = output + String.fromCharCode(chr2);
             }
             if (enc4 != 64) {
                 output = output + String.fromCharCode(chr3);
             }

         }

         output = Base64._utf8_decode(output);

         return output;

     },

     _utf8_encode: function(string) {
         string = string.replace(/\r\n/g, "\n");
         var utftext = "";

         for (var n = 0; n < string.length; n++) {

             var c = string.charCodeAt(n);

             if (c < 128) {
                 utftext += String.fromCharCode(c);
             }
             else if ((c > 127) && (c < 2048)) {
                 utftext += String.fromCharCode((c >> 6) | 192);
                 utftext += String.fromCharCode((c & 63) | 128);
             }
             else {
                 utftext += String.fromCharCode((c >> 12) | 224);
                 utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                 utftext += String.fromCharCode((c & 63) | 128);
             }

         }

         return utftext;
     },

     _utf8_decode: function(utftext) {
         var string = "";
         var i = 0;
         var c = c1 = c2 = 0;

         while (i < utftext.length) {

             c = utftext.charCodeAt(i);

             if (c < 128) {
                 string += String.fromCharCode(c);
                 i++;
             }
             else if ((c > 191) && (c < 224)) {
                 c2 = utftext.charCodeAt(i + 1);
                 string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                 i += 2;
             }
             else {
                 c2 = utftext.charCodeAt(i + 1);
                 c3 = utftext.charCodeAt(i + 2);
                 string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                 i += 3;
             }

         }

         return string;
     }

 }
// 显示繁忙提示
// var showBusy = text => wx.showToast({
//     title: text,
//     icon: 'loading',
//     duration: 10000
// })
//
//  显示成功提示
// var showSuccess = text => wx.showToast({
//     title: text,
//     icon: 'success'
// })
//
//  显示失败提示
// var showModel = (title, content) => {
//     wx.hideToast();
//
//     wx.showModal({
//         title,
//         content: JSON.stringify(content),
//         showCancel: false
//     })
// }

// module.exports = { formatTime, showBusy, showSuccess, showModel, accSub}
module.exports = {
	formatTime,
	accAdd,
	accSub,
	Base64,
}
