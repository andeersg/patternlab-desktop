import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Project extends Component {

  render() {
    const folderName = this.props.path.substr(this.props.path.lastIndexOf('/') + 1);

    return (
      <article className="project">
        <div className="project__top">
          <h1>{folderName}</h1>
          <div className="project__status" />
        </div>
        <div className="project__bottom">
          <button className="button--icon">Start</button>
          <button
            className="button--icon"
            onClick={() => { this.props.open(this.props.path); }}
          >Open</button>
          <button className="button--icon">Configure</button>
          <button className="button--icon">Delete</button>
        </div>
      </article>
    );
  }
}

Project.propTypes = {
  path: PropTypes.string.isRequired,
  open: PropTypes.func.isRequired,
};

export default Project;
