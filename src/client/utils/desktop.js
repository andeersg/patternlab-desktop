import Config from 'electron-config';

const config = new Config({
  defaults: {
    projects: [],
    packageManagerIsInstalled: false,
  },
});

export default {
  config,
  insight: () => { console.log('Implement insights'); },
};
