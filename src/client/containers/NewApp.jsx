import React, { Component } from 'react';
import Config from 'electron-config';
import ProjectList from '../components/ProjectList.jsx';
import Empty from '../components/Empty.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { packageManagerIsInstalled, addProject } from '../utils/fileHelper.js';
import DownloadNode from '../components/DownloadNode.jsx';
import Modal from '../components/Modal';

const config = new Config({
  defaults: {
    projects: [],
  },
});


class NewApp extends Component {

  constructor() {
    super();

    this.openDrawer = this.openDrawer.bind(this);
    this.addProject = this.addProject.bind(this);
    this.selectProject = this.selectProject.bind(this);

    const projects = config.get('projects');
    let currentId = config.get('currentId', false);

    if (!currentId) {
      currentId = projects[0].id;
    }

    this.state = {
      showAddDialog: false,
      projects,
      loaded: false,
      packageManagerIsInstalled: true,
      showProjectList: false,
      currentId,
    };
    // @TODO Update config with current project to easily set it on start.
  }

  componentDidMount() {
    packageManagerIsInstalled()
    .catch(() => {
      // @TODO Show warning if npm command is missing.
      this.setState({
        packageManagerIsInstalled: false,
      });
    });
  }

  openDrawer() {
    this.setState({
      showProjectList: !this.state.showProjectList,
    });
  }

  selectProject(id) {
    this.setState({
      currentId: id,
    });
    config.set('currentId', id);
  }

  addProject() {
    const self = this;
    addProject()
      .then((object) => {
        // Store object.
        const projects = this.state.projects;
        projects.push(object);
        self.setState({
          projects,
        });
        config.set('projects', projects);
      })
      .catch((error) => {
        // Error handling.
        // @TODO Display this error somewhere.
        console.error(error);
      });
  }

  render() {
    // Nice to know if we have projects or not.
    const haveProjects = this.state.projects.length > 0;

    // List of projects.
    const projects = this.state.projects;

    // Get the current project.
    const project = projects.find(item => item.id === this.state.currentId);

    // Should we display that warning.
    const showDownloadModal = !this.state.packageManagerIsInstalled;

    return (
      <div className="app">
        <div className="dragarea" />
        <div className="leftside">
          <header className="header area">
            <h1>
              {haveProjects ? project.name : 'Patternlab'}
              {(haveProjects && projects.length > 1)
                ? <button className="project-chooser" onClick={this.openDrawer}>switch</button>
                : ''
              }
              <button className="" onClick={this.addProject}>Add new</button>
            </h1>
          </header>
          <section className="content area">
            {project ? <p>Project data</p> : <Empty /> }
          </section>
        </div>
        {this.state.selectedProject ?
          <div className="app__sidebar">
            <div className="app__info area">
              <ul className="list list--no">
                <li>Project status</li>
                <li>Created</li>
                <li>Last build</li>
                <li>Address</li>
              </ul>
            </div>
          </div>
        : ''}
        <Modal showModal={showDownloadModal} hide={() => {}}><DownloadNode /></Modal>
        <Sidebar
          location="left"
          open={this.state.showProjectList}
          close={() => { this.setState({ showProjectList: false }); }}
        >
          <ProjectList
            projects={projects}
            select={this.selectProject}
            compact
          />
        </Sidebar>
      </div>
    );
  }
}

export default NewApp;

// @TODO Add a project chooser.
// @TODO Figure out what to use main area for.
// @TODO We can have buttons for Watch(start), Build, Open static version in browser,
// open finder, configure, delete.
// @TODO Add a modal component.
