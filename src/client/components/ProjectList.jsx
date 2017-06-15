import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Project from './Project';

const { shell } = require('electron');

class ProjectList extends Component {
  static openFolder(item) {
    shell.showItemInFolder(item.path);
  }

  render() {
    const projects = this.props.projects || [];
    return (
      <section className="projects">
        {projects.length ? projects.map(item => (
          <Project
            key={item.id}
            {...item}
            open={ProjectList.openFolder}
            compact={this.props.compact}
            select={this.props.select}
          />))
          : <p>No projects yet</p>}
      </section>
    );
  }
}

ProjectList.defaultProps = {
  compact: false,
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  compact: PropTypes.bool,
  select: PropTypes.func.isRequired,
};

export default ProjectList;
