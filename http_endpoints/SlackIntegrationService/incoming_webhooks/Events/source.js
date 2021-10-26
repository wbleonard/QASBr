
// This function is the webhook's request handler.
exports = async function(payload, response) {
    
    var message = EJSON.parse(payload.body.text());
    
    /* Test message 
    message = {
      token: 'XTgR6O8b3XKxzAHqAAK6lfru',
      team_id: 'T02KSNE499N',
      api_app_id: 'A02K05SQ7E1',
      event: 
       { type: 'message',
         subtype: 'bot_add',
         text: 'added an integration to this channel: <https://qasbr.slack.com/services/B02KTFSDSPJ|MongoBot>',
         user: 'U02K033UJER',
         bot_id: 'B02KTFSDSPJ',
         bot_link: '<https://qasbr.slack.com/services/B02KTFSDSPJ|MongoBot>',
         ts: '1635264630.002700',
         channel: 'C02KSNE7D9N',
         event_ts: '1635264630.002700',
         channel_type: 'channel' },
      type: 'event_callback',
      event_id: 'Ev02K627QZ28',
      event_time: 1635264630,
      authorizations: 
       [ { enterprise_id: null,
           team_id: 'T02KSNE499N',
           user_id: 'U02K5BNCK52',
           is_bot: true,
           is_enterprise_install: false } ],
      is_ext_shared_channel: false,
      event_context: '4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUMDJLU05FNDk5TiIsImFpZCI6IkEwMkswNVNRN0UxIiwiY2lkIjoiQzAyS1NORTdEOU4ifQ' };
    */
    
    /* This is being handled by the insert trigger.
    const user = message.event.user;
    if (user == "U02K033UJER") {
      message.event.user_name = "Zuzana Matevossian";
      message.event.user_email = "zuzana.matevossian@mongodb.com";
    } else if (user == "U02K033UJEX") {
      message.event.user_name = "Brian Leonard";
      message.event.user_email = "brian.leonard@mongodb.com";
    }
    */
    
    // if (message.event.bot_id != null){
    //   return message;
    // }

    dbname = "qasbr";
    db = context.services.get("mongodb-atlas").db(dbname);
    
    coll_name = "messages";
    messages_collection = db.collection(coll_name);
    
    await messages_collection.insertOne(message);
    
    
    return  message;
};