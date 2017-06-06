import React, { Component } from 'react';
import Config from 'electron-config';
import Nav from '../components/Nav.jsx';
import ProjectList from '../components/ProjectList.jsx';
import Empty from '../components/Empty.jsx';
import AddForm from '../components/AddForm.jsx';


const config = new Config({
  defaults: {
    projects: [],
  },
});


class App extends Component {

  constructor() {
    super();

    this.state = {
      showAddDialog: false,
      projects: config.get('projects'),
    };
    this.addNew = this.addNew.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  addNew(e) {
    e.preventDefault();

    this.setState({
      showAddDialog: true,
    });
  }

  hideModal() {
    this.setState({
      showAddDialog: false,
    });
  }

  submitData(data) {
    const projects = this.state.projects;
    projects.push(data);
    config.set('projects', projects);
    this.setState({
      projects,
    });
  }

  render() {
    const projects = this.state.projects;

    const mainContent = <Empty />;


    return (
      <div className="spa">
        <div className="spa__content">
          {mainContent}
          {this.state.showAddDialog ? <AddForm hideOverlay={this.hideModal} submitData={this.submitData} /> : ''}
        </div>
        <div className="panel">
          <ProjectList projects={projects} />
          <Nav addNew={this.addNew} />
        </div>
      </div>
    );
  }
}

export default App;
