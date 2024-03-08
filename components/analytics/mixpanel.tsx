import mixpanel from 'mixpanel-browser';
import { MIX_PANEL_TOKEN } from "../../config/config";

mixpanel.init(`${MIX_PANEL_TOKEN}`, {debug: true}); 

// let env_check = process.env.NODE_ENV === 'production';

let actions = {
  identify: (id: string) => {
    mixpanel.identify(id);
  },
  alias: (id: string) => {
    mixpanel.alias(id);
  },
  track: (trackDetails:{name: any,project_id:any,company_id:string,screen_name:string,event_category:string,event_action:string ,user_id:string,error_message?:string,layout?:string,notifications_count?:number,sorting_type?:any,parent?:any,projects_count?:0}) => {
    mixpanel.track(trackDetails.name, { 
    "platform": "web",
    "app": "rahman",
    "environment": "qa",
    "project_id": trackDetails.project_id,
    "company_id": trackDetails.company_id,
    "screen_name":trackDetails.screen_name,
    "event_category":trackDetails.event_category,
    "event_action": trackDetails.event_action,
    "app_version": "10.2",
    "error_message":trackDetails.error_message,
    "layout_type":trackDetails.layout,
    "notifications_count":trackDetails.notifications_count,
    "sorting_type":trackDetails.sorting_type,
    "user_id" : trackDetails.user_id,
    "parent":trackDetails.parent,
    "projects_count":trackDetails.projects_count
  });
  },
  people: {
    set: (props: any) => {
      mixpanel.people.set(props);
    },
  },
  temp: () => {
    console.log('MIXPANEL', mixpanel.has_opted_in_tracking())
  }
};

export let Mixpanel = actions;
