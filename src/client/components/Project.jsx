import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Project extends Component {

  render() {
    const folderName = this.props.path.substr(this.props.path.lastIndexOf('/') + 1);

    return (
      <article className="project" onClick={e => this.props.select(this.props.id, e)}>
        <div className="project__top">
          <h1>{folderName}</h1>
          <div className="project__status" />
        </div>
        {!this.props.compact ?
          <div className="project__bottom">
            <button className="button--icon">Start</button>
            <button
              className="button--icon"
              onClick={() => { this.props.open(this.props.path); }}
            >Open</button>
            <button className="button--icon">Configure</button>
            <button className="button--icon">Delete</button>
          </div>
        : ''}
      </article>
    );
  }
}

Project.defaultProps = {
  compact: false,
};

Project.propTypes = {
  path: PropTypes.string.isRequired,
  open: PropTypes.func.isRequired,
  compact: PropTypes.bool,
  select: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default Project;
