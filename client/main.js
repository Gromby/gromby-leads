import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SubscribedPages } from '../imports/collections.js';

import './main.html';

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1007039122651117',
    status     : true,
    xfbml      : true
  });
};

Template.login.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.pages = new ReactiveVar([]);
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
      SubscribedPages.insert(page_data);
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
