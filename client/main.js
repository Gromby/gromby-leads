import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SubscribedPages, GrombyLeads } from '../imports/collections.js';

import './main.html';

Template.login.onRendered(function helloOnRendered() {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1007039122651117',
      status     : true,
      xfbml      : true
    });
  };
});

Template.login.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.pages = new ReactiveVar([]);

});

Template.body.onCreated(function bodyonCreate() {
  this.subscribe('pages');
  this.subscribe('remote-items', 'onlygromby143');
});

Template.body.helpers({
  leads() {
    var leads = GrombyLeads.find().fetch();
    return leads.map(function(lead) {
      var return_value = {};
      if (!lead.data.field_data) return {};
      lead.data.field_data.forEach(function(datum){
        return_value[datum.name] = datum.values.join(' ');
      });
      return JSON.stringify(return_value);
    });
  }
});

Template.login.helpers({
  pages() {
    return Template.instance().pages.get();
  },
});

Template.login.events({
  'click .subsribetopage'(event, template) {
    console.log(this);
    var page_data = this;
    FB.api('/' + this.id + '/subscribed_apps', 'post',
    { access_token: this.access_token }, function(response){
      console.log(response);
      if (!SubscribedPages.findOne({ id: page_data.id })) {
        alert('Gromby Leads is now subscribed to the lead events of your page.');
        SubscribedPages.insert(page_data);
      }
    });
  },
  'click .login'(event, template) {
    // increment the counter when button is clicked
    var instance = this;
    FB.login(function(response) {
        console.log('LOGGED IN', response);
        FB.api('me/accounts', function(response) {
          console.log('Retrieved Page', response);
          template.pages.set(response.data);
        });
    }, { scope: 'manage_pages' });
  },
});
