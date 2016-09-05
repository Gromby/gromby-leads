import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
import { GrombyLeads, SubscribedPages } from '../imports/collections.js';

Meteor.publish('remote-items', function(grombyKey) {
  if (grombyKey !== 'onlygromby143') {
    console.log('un-authorized remote connection!');
    return;
  }
  return GrombyLeads.find({});
});

Meteor.startup(() => {
  WebApp.connectHandlers
  .use("/hello", function(req, res, next) {
    res.writeHead(200);
    // res.end("Hello world from: " + Meteor.release);
    var match_challenge = /hub.challenge=(.*)&/.exec(req.url);
    var challenge = match_challenge && match_challenge[1];
    var match_verify = /hub.verify_token=(.*)/.exec(req.url);
    var verify_token = match_verify && match_verify[1];

    if (verify_token === 'gromby123') {
      res.writeHead(200);
      res.end(challenge);
    } else {

      var body = "";
      req.on('data', Meteor.bindEnvironment(function (data) {
        body += data;
      }));

      req.on('end', Meteor.bindEnvironment(function () {
        console.log(body);
        console.log(typeof(body));
        var json = JSON.parse(body);
        var leadgenid = json.entry[0]['changes'][0]['value']['leadgen_id'];
        var page_id = json.entry[0]['id'];

        var subscribedToPage = SubscribedPages.findOne({ id: page_id });
        if (subscribedToPage) {
          var access_token = subscribedToPage.access_token;
          HTTP.get('https://graph.facebook.com/v2.7/' + leadgenid + '?access_token=' + access_token, function(err, success) {
            GrombyLeads.insert(success);
          });
        }
        res.writeHead(200);
        res.end();
      }));
    }

  });
});
