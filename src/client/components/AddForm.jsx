const React = require('react');
const { dialog } = window.require('electron').remote;
const { checkEmptyness } = require('../utils/fileHelper.js');

class AddForm extends React.Component {
  constructor() {
    super();

    this.formChange = this.formChange.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.saveProject = this.saveProject.bind(this);

    this.state = {
      title: '',
      path: '',
      project_type: 'gulp',
      clean: true,
    };
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

  componentDidMount() {
    const folder = dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']});
    if (Array.isArray(folder)) {
      const empty = checkEmptyness(folder[0]);
      this.setState({
        path: folder[0],
        clean: empty
      });
    }
  }
  
  render() {
    // Step 1: Add a project name
    // Step 2: Select a folder
    // Step 3: Select platform (or skip it)
    // Step 4: Progress bar and finish
    
    const data = JSON.stringify(this.state, null, 2);
    
    return (
      <section className="adding">
        <div className="adding__form">
          <div className="element">
            <label className="element__label">Project name</label>
            <input type="text" className="element__input" id="title" name="title" onChange={this.formChange} />
          </div>

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
        <div className="adding__backdrop" onClick={this.props.hideOverlay}></div>
      </section>
    );
  }
}

export default AddForm;