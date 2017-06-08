import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

const { dialog } = require('electron').remote;
const { checkEmptyness, validateProject } = require('../utils/fileHelper.js');

class AddForm extends React.Component {
  constructor() {
    super();

    this.formChange = this.formChange.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.saveProject = this.saveProject.bind(this);

    this.state = {
      path: '',
      project_type: 'gulp',
      clean: true,
    };
  }

  componentDidMount() {
    dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }, (folder) => {
      if (Array.isArray(folder)) {
        const empty = checkEmptyness(folder[0]);
        const data = {
          path: folder[0],
          clean: empty,
          id: shortid.generate(),
        };

        this.setState(data);

        if (!empty) {
          const validProject = validateProject(folder[0]);
          if (validProject) {
            console.log('Project is valid, add it.');
            this.setState({ project_type: validProject });
            this.saveProject();
          }
        }
      }
    });
  }

  formChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  selectProject(event) {
    this.setState({ project_type: event.target.id });
  }

  saveProject() {
    this.props.submitData(this.state);
    this.props.hideOverlay();
  }

  render() {
    const data = JSON.stringify(this.state, null, 2);

    return (
      <section className="adding">
        <div className="adding__form">
          {this.state.clean ?
            <div className="chooser">
              <div className={this.state.project_type === 'gulp' ? 'chooser__item chooser__item--selected' : 'chooser__item'}>
                <img src="images/gulp.svg" alt="" id="gulp" onClick={this.selectProject} />
              </div>
              <div className={this.state.project_type === 'grunt' ? 'chooser__item chooser__item--selected' : 'chooser__item'}>
                <img src="images/grunt.svg" alt="" id="grunt" onClick={this.selectProject} />
              </div>
            </div>
          : <p>We should verify the project is patternlab</p>}
          <pre>{data}</pre>

          <button className="save" onClick={this.saveProject}>Save</button>

          <div className="progress-wrapper">
            <div className="progress-page 1"></div>
            <div className="progress-page 2"></div>
            <div className="progress-page 3"></div>
            <div className="progress-page 4"></div>
          </div>

        </div>
        <div className="adding__backdrop" onClick={this.props.hideOverlay} />
      </section>
    );
  }
}

AddForm.propTypes = {
  hideOverlay: PropTypes.func.isRequired,
  submitData: PropTypes.func.isRequired,
};

export default AddForm;
