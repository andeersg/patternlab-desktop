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
        {projects.length ? projects.map(item =>
          <Project key={item.id} {...item} open={ProjectList.openFolder} />)
          : <p>No projects yet</p>}
      </section>
    );
  }
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default ProjectList;
