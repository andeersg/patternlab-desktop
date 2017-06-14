const React = require('react');

class Empty extends React.Component {
  render() {
    return (
      <section className="empty">
        <h1 className="empty__title">No projects yet!</h1>
        <p>Get started by adding a project.</p>
        <button>Add a project</button>
      </section>
    );
  }
}

export default Empty;
