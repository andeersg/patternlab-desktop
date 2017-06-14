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
      clean: false,
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

    // Don't render popup before we need feedback.
    if (!this.state.clean) {
      return null;
    }

    return (
      <section className="adding">
        <div className="adding__form">
          {this.state.clean ?
            <div className="chooser">
              <div className={this.state.project_type === 'gulp' ? 'chooser__item chooser__item--selected' : 'chooser__item'}>
                <button id="gulp" onClick={this.selectProject}>Gulp</button>
              </div>
              <div className={this.state.project_type === 'grunt' ? 'chooser__item chooser__item--selected' : 'chooser__item'}>
                <button id="grunt" onClick={this.selectProject}>Grunt</button>
              </div>
            </div>
          : <p>We should verify the project is patternlab</p>}
          <pre>{data}</pre>

          <button className="save" onClick={this.saveProject}>Save</button>

        </div>
        <div
          className="adding__backdrop"
          role="button"
          tabIndex="0"
          onClick={this.props.hideOverlay}
        />
      </section>
    );
  }
}

AddForm.propTypes = {
  hideOverlay: PropTypes.func.isRequired,
  submitData: PropTypes.func.isRequired,
};

export default AddForm;
