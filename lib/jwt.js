function base64UrlEncode(str) {
    let encodedSource = CryptoJS.enc.Base64.stringify(str);
    let reg = new RegExp('/', 'g');
    encodedSource = encodedSource.replace(/=+$/,'').replace(/\+/g,'-').replace(reg,'_');
    return encodedSource;
}

function generateToken(secretSalt) {
    secretSalt = secretSalt.split(".");
    let header = JSON.stringify({
        "alg": "HS256",
        "sign_type": "SIGN"
    })

    let iat = new Date().getTime()
    let exp = iat + 2*60*60*1000
    let payload =JSON.stringify({
        "api_key": secretSalt[0],
        "exp": exp,
        "timestamp": iat,
    })

    let before_sign = base64UrlEncode(CryptoJS.enc.Utf8.parse(header)) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(payload));
    let signature =CryptoJS.HmacSHA256(before_sign, secretSalt[1]);
    signature = base64UrlEncode(signature);
    let final_sign = before_sign + '.' + signature;
    return final_sign;
}
module.exports = generateToken;