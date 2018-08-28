var CryptoJS = require("crypto-js");

CryptoJS.enc.u8array = {
    stringify: function (wordArray) {
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        var u8 = new Uint8Array(sigBytes);
        for (var i = 0; i < sigBytes; i++) {
            var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            u8[i]=byte;
        }
        return u8;
    },

    parse: function (u8arr) {
        var len = u8arr.length;
        var words = [];
        for (var i = 0; i < len; i++) {
            words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
        }
        return CryptoJS.lib.WordArray.create(words, len);
    }
};

DataType = {
    base64To16Bytes: function(b64) {
        var binary = atob(b64);
        var length = binary.length;
        var bytes = new Uint8Array(16);
        for (var i = 0, j = 2; j < length; i++, j++) {
            // Ignore the top 2 bytes(0x01, 0x08)
            bytes[i] = binary.charCodeAt(j);
        }
        return bytes;
    },

    hexTo16Bytes: function(hex) {
        var bytes = new Uint8Array(16);
        for (var i = 0, j = 0; i < hex.length; i+=2, j++) {
            var substr = hex.substring(i, i+2);
            bytes[j] = parseInt(substr, 16);
        }
        return bytes;
    },

    binaryToString: function(bytes) {
        var result = '';
        for (var i = 0; i < bytes.length; i++) {
            result += String.fromCharCode(bytes[i]);
        }
        return result;
    },

    binaryToHexString: function(bytes) {
        var result = '';
        for (var i = 0; i < bytes.length; i++) {
            var hex = (bytes[i] & 0xff).toString(16);
            hex = hex.length === 1 ? '0' + hex : hex;
            result += hex;
        }
        return result.toUpperCase();
    }
};
export var PayCode = (function(){
    function PayCode(key,uid,clock){
        this.key = key;
        this.uid = uid;
        this.clock = clock?clock:30;
    }

    PayCode.prototype.next = function(){
        var time = parseInt(Date.now() / (1000 * this.clock));
        var hash = CryptoJS.HmacSHA1(time.toString(), this.key);
        var hashArray = CryptoJS.enc.u8array.stringify(hash);
        var offset = parseInt(hashArray[19]&0xf);
        var snum = hashArray.subarray(offset,offset+4);

        var result = 0;

        result = ((snum[0]&0x7f) * Math.pow(2,24));
        result += ((snum[1]&0xff)* Math.pow(2,16));
        result += ((snum[2]&0xff)* Math.pow(2,8));
        result += ((snum[3]<<0)&0xff);

        var result = parseInt(result % Math.pow(10,4));

        return this.generatorOTP(result)
    };
    
    PayCode.prototype.padding = function (data,length){
        var result = data.toString();
        while(result.length<length){
            result = "0"+result
        }
        return result;
    };

    PayCode.prototype.generatorOTP = function (result){
        var UID = this.uid + 10000000000 ;

        while(result < Math.pow(10,3)){
            result *= 10
        }

        var factor = 5;
        var x = result;
        var y = parseInt(UID / x + factor * x);
        var z = (UID % x);


        return "36" + this.padding(x,4) + this.padding(y,8) + this.padding(z,4)
    };
    return PayCode
})();

export var PreLinePayCode = (function(){
    function PreLinePayCode(key,uid,clock){
        this.key = key;
        this.uid = uid;
        this.clock = clock?clock:30;
    }

    PreLinePayCode.prototype.next = function(){
        var time = parseInt(Date.now() / (1000 * this.clock));
        var hash = CryptoJS.HmacSHA1(time.toString(), this.key);
        var hashArray = CryptoJS.enc.u8array.stringify(hash);
        var offset = parseInt(hashArray[19]&0xf);
        var snum = hashArray.subarray(offset,offset+4);

        var result = 0;

        result = ((snum[0]&0x7f) * Math.pow(2,24));
        result += ((snum[1]&0xff)* Math.pow(2,16));
        result += ((snum[2]&0xff)* Math.pow(2,8));
        result += ((snum[3]<<0)&0xff);

        var result = parseInt(result % Math.pow(10,4));

        return this.generatorOTP(result)
    };

    PreLinePayCode.prototype.padding = function (data,length){
        var result = data.toString();
        while(result.length<length){
            result = "0"+result
        }
        return result;
    };

    PreLinePayCode.prototype.generatorOTP = function (result){
        var UID = this.uid + 10000000000 ;

        while(result < Math.pow(10,3)){
            result *= 10
        }

        var factor = 5;
        var x = result;
        var y = parseInt(UID / x + factor * x);
        var z = (UID % x);


        return "TC" + this.padding(x,4) + this.padding(y,8) + this.padding(z,4)
    };
    return PreLinePayCode
})();