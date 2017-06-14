import React, { Component } from 'react';
import Config from 'electron-config';
import Nav from '../components/Nav.jsx';
import ProjectList from '../components/ProjectList.jsx';
import Empty from '../components/Empty.jsx';
import Sidebar from '../components/Sidebar.jsx';
import AddForm from '../components/AddForm.jsx';
import { packageManagerIsInstalled } from '../utils/fileHelper.js';
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

    this.state = {
      showAddDialog: false,
      projects: config.get('projects'),
      loaded: false,
      packageManagerIsInstalled: true,
      showProjectList: false,
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

  render() {
    // Nice to know if we have projects or not.
    const haveProjects = this.state.projects.length > 0;

    // List of projects.
    const projects = this.state.projects;

    // The current selected project.
    const project = projects[this.state.selectedProject ? this.state.selectedProject : 0];

    // Extract folder name.
    const projectName = project.path.substr(project.path.lastIndexOf('/') + 1);

    const showDownloadModal = !this.state.packageManagerIsInstalled;

    return (
      <div className="app">
        <div className="dragarea" />
        <div className="leftside">
          <header className="header area">
            <h1>
              {haveProjects ? projectName : 'Patternlab'}
              {(haveProjects && projects.length > 1)
                ? <button className="project-chooser" onClick={this.openDrawer}>switch</button>
                : ''
              }
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
          <ProjectList projects={projects} compact />
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
