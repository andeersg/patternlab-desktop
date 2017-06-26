/* globals desktop */

import React, { Component } from 'react';
import ProjectList from '../components/ProjectList.jsx';
import Project from '../components/Project.jsx';
import Empty from '../components/Empty.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { packageManagerIsInstalled, addProject } from '../utils/fileHelper.js';
import DownloadNode from '../components/DownloadNode.jsx';
import Loading from '../components/Loading';

const debug = require('debug')('pl');


class App extends Component {
  constructor() {
    super();

    this.openDrawer = this.openDrawer.bind(this);
    this.addProject = this.addProject.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.checkPM = this.checkPM.bind(this);

    const projects = desktop.config.get('projects');
    let currentId = desktop.config.get('currentId', false);

    if (!currentId) {
      currentId = projects[0].id;
    }

    this.state = {
      showAddDialog: false,
      projects,
      loaded: false,
      packageManagerIsInstalled: desktop.config.get('packageManagerIsInstalled'),
      showProjectList: false,
      currentId,
      loading: false,
      loadingMessage: '',
    };
  }

  componentDidMount() {
    if (!desktop.config.get('packageManagerIsInstalled')) {
      this.checkPM();
    }
  }

  checkPM() {
    packageManagerIsInstalled()
    .then(() => {
      desktop.config.set('packageManagerIsInstalled', true);
    })
    .catch(() => {
      // @TODO Show warning if npm command is missing.
      this.setState({
        packageManagerIsInstalled: false,
      });
      setTimeout(() => {
        this.checkPM();
      }, (1000 * 60 * 3));
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
    desktop.config.set('currentId', id);
  }

  addProject() {
    const self = this;
    this.setState({ loading: true });

    addProject(false, (message) => { this.setState({ loadingMessage: message }); })
      .then((object) => {
        debug(`"${object.path}" is added.`);

        // Store object.
        const projects = this.state.projects;
        const updatedState = {};

        if (projects.length === 0) {
          updatedState.currentId = object.id;
          desktop.config.set('currentId', object.id);
        }

        projects.push(object);
        updatedState.projects = projects;
        updatedState.loading = false;

        self.setState(updatedState);
        desktop.config.set('projects', projects);
      })
      .catch((error) => {
        // Error handling.
        // @TODO Display this error somewhere.
        debug(`Error: ${error}`);
        self.setState({ loading: false });
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
        <header className="app__header">
          <div className="app__branding">
            <img src="assets/pl.svg" alt="Logo" className="app__logo" />
            <h1>
              {haveProjects ? project.name : 'Patternlab'}
            </h1>
          </div>
          <div className="">
            {(haveProjects && projects.length > 1)
              ? <button className="button" onClick={this.openDrawer}>Projects</button>
              : ''
            }
            <button className="button" onClick={this.addProject}>Add project</button>
          </div>
        </header>
        <section className="content area">
          {project ? <Project project={project} /> : <Empty /> }
        </section>

        {showDownloadModal ? <DownloadNode reCheck={this.checkPM} /> : ''}

        <Loading show={this.state.loading} message={this.state.loadingMessage} />

        <Sidebar
          location="left"
          open={this.state.showProjectList}
          close={() => { this.setState({ showProjectList: false }); }}
        >
          <ProjectList
            projects={projects}
            select={this.selectProject}
            current={this.state.currentId}
          />
        </Sidebar>
      </div>
    );
  }
}

export default App;
