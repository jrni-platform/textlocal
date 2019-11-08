

let https = require('https');
const bbCore = require('sdk');

exports.send_sms = (data, callback) => {

    // the url to shorten
    const message = data.message;
    const recipient = data.recipient;

    // get the token from config
    const apikey = bbCore.getConfigValue('api_key');
    const sender = bbCore.getConfigValue('sender');

    const options = {
        host: 'api.txtlocal.com', port: 443,
        path: "/send/?apikey=" + apikey + "&numbers=" + recipient + "&message=" + encodeURIComponent(message) + "&sender=" + sender,
        method: 'GET'
    };

    console.log(data);
    console.log(options);

    const req = https.request(options, (res) => {
        res.on('data', (d) => {
            let body = d.toString()
            console.log(body)
            body = JSON.parse(body);
            // did we get a successful result from textlocal?
            if (body.status == "sucess") {
                console.log("Message send successfully")
                callback(null, {success: true});
            } else {
                // if it failed for some reason  - maybe we want to use the fallback - maybe we just want to give up
                callback(null, {success: true})
            }
        });
    });

    req.on('error', (e) => {
        // error use the fallback
        console.error(e);
        callback(null, {fallback: true});
    });
    req.end();

};

