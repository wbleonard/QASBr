/*
  Slack Message Transform Function
    fires on update/insert in materialized view collection
    takes full document, looks up orderable and embeds
*/
exports = async function(changeEvent) {
  //const doc_id = changeEvent.documentKey._id;
  const fullDoc = changeEvent.fullDocument;
  var changeType = changeEvent.operationType;
  if(fullDoc.event.bot_id){
    return true
  }
  // get Handle to collections
  const gMessageColl = context.services.get("mongodb-atlas").db("qasbr").collection("messages");
  const gMetaColl = context.services.get("mongodb-atlas").db("qasbr").collection("metadata");
  const gFocusColl = context.services.get("mongodb-atlas").db("qasbr").collection("focus_areas");
  console.log("Looking up" + fullDoc.event.user);
  var user_id = fullDoc.event.user;
  var channel_id = fullDoc.event.channel;
  var isFound = false;
  var query = {type: "user", "user_id": user_id}
  console.log(JSON.stringify(fullDoc));
  var answer = await gMetaColl.findOne(query);
  console.log("Lookup: "+JSON.stringify(answer));
  if(!!answer.author) {
    console.log("Found! id: " + fullDoc._id + " updating: " + answer.author);
    lookupc = await gMetaColl.findOne({type: "channel", "channel_id": channel_id});
    gMessageColl.updateOne({ "_id" : fullDoc._id },{"$set" : {"author" : answer.author, "channel_name" : lookupc.channel, "is_question" : true}}); 
  }
  // Send to RASA
  var shoulds = []
  var terms = fullDoc.event.text.split(" ");
  console.log(terms[0])

  // look at sentiment
  
  // Lookup focus groups/subject keywords - identify expert
  var pipe = [
          {"$search": {
            "compound" : {
              "should" : [
                  {"text" : {"query" :terms, "path" : "keywords"}}
  
                ]
            }
          }},
          {"$project": {"score": {"$meta": "searchScore"},"channel": 1}}        ]
  var ans = "";
  var focus_res = await gFocusColl.aggregate(pipe).toArray();
  // focus_res.forEach(item=>{
  //   ans = item;
  // })
  
  
  // send confirm back to slack "Got your question @Brayd abd @Zuzana are working onit"
  var msg = "Thanks for your question, our experts will respond as soon as possible. Pinging our experts in ";
  var result = context.functions.execute("slackResponse", lookupc.channel, msg, fullDoc.event.user, focus_res[0]);
  // 

};
