import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { spawn } from 'child_process';
import { parseOutput } from '../utils/patternlabHelper.js';

const { shell } = require('electron');
const debug = require('debug')('pl');

class Project extends Component {
  constructor() {
    super();

    this.startProject = this.startProject.bind(this);
    this.openExternal = this.openExternal.bind(this);
    this.openFolder = this.openFolder.bind(this);

    this.state = {
      running: false,
      port: false,
      bsPort: false,
      runtime: {},
    };
  }

  openExternal() {
    if (this.state.running && this.state.runtime.local) {
      shell.openExternal(this.state.runtime.local);
      debug('Open external browser');
    }
  }

  openFolder() {
    shell.showItemInFolder(this.props.project.path);
    debug('Open file explorer');
  }

  startProject() {
    const running = this.state.running;
    const args = [
      'start',
      '--prefix',
      this.props.project.path,
    ];

    if (running) {
      this.currentSpawn.kill();
      debug('Killing project');
    } else {
      debug('Starting project');
      this.currentSpawn = spawn('npm', args);
      this.currentSpawn.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);
        // console.log(parseOutput(data.toString()));
        // @TODO Parse output and use it for gui.
        const extractedData = parseOutput(data.toString());
        if (extractedData) {
          const runtimeData = { ...this.state.runtime };
          extractedData.forEach((item) => {
            runtimeData[item.key] = item.value;
          });

          this.setState({
            runtime: runtimeData,
          });
        }
      });
    }
    this.setState({
      running: !running,
    });
  }

  render() {
    const project = this.props.project;

    return (
      <article className="project">

        <div className="project__bottom">
          <button className="button" onClick={this.startProject}>
            {this.state.running ? 'Stop' : 'Start'}
          </button>
          <button
            className="button"
            onClick={() => { this.openFolder(project.path); }}
          >Open folder</button>
          <button
            className="button"
            onClick={() => { this.openExternal(); }}
          >Open browser</button>
        </div>

        <div className="project__sidebar">
          <ul>
            <li>Running: {this.state.running ? 'Running' : 'Stopped'}</li>
            <li>Created: {project.added}</li> {/* @TODO Use moment.js */}
            <li>Local: {this.state.runtime.local ? this.state.runtime.local : ''}</li>
            <li>External: {this.state.runtime.external ? this.state.runtime.external : ''}</li>
            <li>Browsersync: {this.state.runtime.ui ? this.state.runtime.ui : ''}</li>
          </ul>
        </div>

      </article>
    );
  }
}

Project.propTypes = {
  project: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default Project;
