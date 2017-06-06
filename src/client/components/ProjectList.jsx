import React, { Component } from 'react';
const { shell } = window.require('electron');

class ProjectList extends Component {
  constructor() {
    super();

    this.openProjectFolder = this.openProjectFolder.bind(this);
  }

  openProjectFolder(item) {
    shell.showItemInFolder(item.path);
  }

  render() {
    const projects = this.props.projects || [];
    return (
      <section className="projects">
        {projects.length ? projects.map((item, id) => (
          <article key={id} className="project">
            <div className="project__top">
              <h1>{item.title}</h1>
              <div className="project__status"></div>
            </div>
            <div className="project__bottom">
              <button className="button--icon">Start</button>
              <button className="button--icon" onClick={() => { this.openProjectFolder(item); }}>Open</button>
              <button className="button--icon">Configure</button>
              <button className="button--icon">Delete</button>
            </div>
          </article>
        )) : <p>No projects yet</p>}
      </section>
    );
  }
}

export default ProjectList;