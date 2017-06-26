import React from 'react';
import PropTypes from 'prop-types';

class DownloadNode extends React.Component {
  render() {
    const platformLink = 'https://nodejs.org';

    return (
      <section className="download">
        <p>You need Node.js installed for this to work.</p>
        <p>You can <a href={platformLink}>download and install it here</a>.</p>
        <p><button onClick={this.props.reCheck}>Check again</button></p>
      </section>
    );
  }
}

DownloadNode.propTypes = {
  reCheck: PropTypes.func.isRequired,
};

export default DownloadNode;
