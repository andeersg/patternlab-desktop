/* globals desktop */
import ua from 'universal-analytics';

const debug = require('debug')('pl:insight');

const Insight = () => {};

export default Insight;

function getUserId() {
  return desktop.config.get('insight.userId', false);
}

function createUserId() {
  const uuidv4 = require('uuid/v4'); // eslint-disable-line global-require
  desktop.config.set('insight.userId', uuidv4());
}

/**
 * Send events to Google Analytics.
 */
Insight.sendEvent = (category, action, label, value) => {
  const params = {
    t: 'event',
    ec: category,
    ea: action,
  };
  if (label !== null && label !== undefined) {
    params.el = label;
  }
  if (value !== null && label !== undefined) {
    params.ev = value;
  }
  return this.send(params);
};

/**
 * Check if Analytics is enabled.
 */
Insight.isDisabled = () => desktop.config.get('insight.disabled') === 'true';

/**
 * Enable Analytics.
 */
Insight.enable = () => {
  desktop.config.set('insight.disabled', false);
};

/**
 * Disable Analytics.
 */
Insight.disable = () => {
  desktop.config.set('insight.disabled', true);
};

/**
 * Send the data to GA.
 */
Insight.send = (params) => {
  if (this.isDisabled()) {
    return;
  }

  // Send that stuff
  if (params.t === 'event') {
    debug('Send GA Event');
    this.visitor.event(params).send();
  }
};

/**
 * Initialize.
 */
Insight.init = (cb) => {
  if (getUserId() || this.isDisabled()) {
    // What happens now?
    this.visitor = ua('UA-XXXX-XX', getUserId());

    cb();
  } else {
    createUserId();
    this.visitor = ua('UA-XXXX-XX', getUserId());
    cb();
  }
};
