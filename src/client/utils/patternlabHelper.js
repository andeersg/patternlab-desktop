
export function parseOutput(message) {
  const localUrl = message.match(/Local: (.+):([0-9]+)/);
  const remoteUrl = message.match(/External: (.+):([0-9]+)/);
  const uiUrl = message.match(/UI: (.+):([0-9]+)/);

  if (localUrl) {
    return {
      key: 'local',
      value: `${localUrl[1]}:${localUrl[2]}`,
    };
  } else if (remoteUrl) {
    return {
      key: 'external',
      value: `${remoteUrl[1]}:${remoteUrl[2]}`,
    };
  } else if (uiUrl) {
    return {
      key: 'ui',
      value: `${uiUrl[1]}:${uiUrl[2]}`,
    };
  }

  return false;
}
