exports = async function(arg){
  
  // Compose Bing Entity Search URL
  const requestUrl = "http://ec2-54-226-88-1.compute-1.amazonaws.com:5005/webhooks/rest/webhook";
  const headers = {
    "content-type": ["application/json"],
    "accept": ["application/json"],
  };
  
  var body = {
    "message": arg
  }
    
  const response = await context.http  
    .post({ url: requestUrl,
      headers: headers,
      body:JSON.stringify(body)
   });
  
  var body_text = EJSON.parse(response.body.text())
  
  console.log(body_text[0].text)
  
  // The response body is a BSON.Binary object. Parse it and return.
  return body_text[0].text

}