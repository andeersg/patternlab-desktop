// @TODO One message may contain multiple pieces we want.

export function parseOutput(message) {
  const localUrl = message.match(/Local: (.+):([0-9]+)/);
  const remoteUrl = message.match(/External: (.+):([0-9]+)/);
  const uiUrl = message.match(/UI: (.+):([0-9]+)/);

  const results = [];

  if (localUrl) {
    results.push({
      key: 'local',
      value: `${localUrl[1]}:${localUrl[2]}`,
    });
  }
  if (remoteUrl) {
    results.push({
      key: 'external',
      value: `${remoteUrl[1]}:${remoteUrl[2]}`,
    });
  }
  if (uiUrl) {
    results.push({
      key: 'ui',
      value: `${uiUrl[1]}:${uiUrl[2]}`,
    });
  }

  if (results.length > 0) {
    return results;
  }

  return false;
}

export const amazingValue = 'this value is amazing';
