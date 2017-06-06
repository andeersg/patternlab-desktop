const React = require('react');

class Empty extends React.Component {
  render() {
    return (
      <section className="empty">
        <h1 className="empty__title">No projects yet!</h1>
      </section>
    );
  }
}

export default Empty;