import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProjectList extends Component {

  render() {
    // onClick={e => this.props.select(this.props.id, e)}

    const projects = this.props.projects || [];
    return (
      <section className="projects">
        <ul className="menu">
          {projects.length ? projects.map(item => (
            <li key={item.id}><span
              className="menu__item"
              key={item.id}
              tabIndex="0"
              role="button"
              onClick={e => this.props.select(item.id, e)}
            >{item.name}</span></li>
            ))
            : <p>No projects yet</p>}
        </ul>
      </section>
    );
  }
}

ProjectList.defaultProps = {
  compact: false,
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  select: PropTypes.func.isRequired,
};

export default ProjectList;
