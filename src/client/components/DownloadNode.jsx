const React = require('react');

class DownloadNode extends React.Component {
  render() {
    let platformLink = '';

    switch (process.platform) {
      case 'darwin':
        platformLink = 'https://nodejs.org/dist/v6.11.0/node-v6.11.0.pkg';
        break;
      case 'win32':
        if (process.arch === 'x86') {
          platformLink = 'https://nodejs.org/dist/v6.11.0/node-v6.11.0-x86.msi';
        } else {
          platformLink = 'https://nodejs.org/dist/v6.11.0/node-v6.11.0-x64.msi';
        }
        break;
      default:
        platformLink = 'https://nodejs.org';
    }

    return (
      <section className="download">
        <p>You need Node.js installed for this to work.</p>
        <p>You can <a href={platformLink}>download and install it here</a>.</p>
      </section>
    );
  }
}

export default DownloadNode;
