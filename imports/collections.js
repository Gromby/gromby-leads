import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const GrombyLeads = new Mongo.Collection('gromby_leads');
export const SubscribedPages = new Mongo.Collection('gromby_fb_pages');
