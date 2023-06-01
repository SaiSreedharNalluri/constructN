import mixpanel from 'mixpanel-browser';
mixpanel.init(`${process.env.MIX_PANEL_TOKEN}`, {debug: true}); 

let env_check = process.env.NODE_ENV === 'production';

let actions = {
  identify: (id: string) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id: string) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name: string, props?: any) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props: any) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
  temp: () => {
    if (env_check) console.log('MIXPANEL', mixpanel.has_opted_in_tracking())
  }
};

export let Mixpanel = actions;
