import Store from 'electron-store';

const config = new Store({
  defaults: {
    projects: [],
    packageManagerIsInstalled: false,
  },
});

export default {
  config,
  insight: () => { console.log('Implement insights'); },
};
