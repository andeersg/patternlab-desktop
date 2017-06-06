const React = require('react');

class Nav extends React.Component {
  render() {
    return (
      <nav className="navigation">
        <a onClick={this.props.addNew} className="button">Add project</a>
      </nav>
    );
  }
}

export default Nav;