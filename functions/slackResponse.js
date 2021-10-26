exports = async function(slack_channel, message, customer_id, focus_area){
  
  area = (focus_area == null ? '' : focus_area);

  msg = message + area + " <@" +customer_id+ ">";
  
  channel = (slack_channel == null ? 'answering-questions' : slack_channel);
  
  
  

var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'POST',
  'hostname': 'slack.com',
  'path': '/api/chat.postMessage',
  'headers': {
    'Authorization': 'Bearer xoxb-2672762145328-2651396427172-h1U18Wjl3fbgtPGpIEYlBByW',
    'Content-Type': 'application/json'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData = JSON.stringify({
  "channel": channel,
  "text": msg
});

req.write(postData);

req.end();

};