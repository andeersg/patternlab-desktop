import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Sidebar extends Component {
  render() {
    const sidebarClass = classNames({
      sidebar: true,
      'sidebar--left': this.props.location === 'left',
      'sidebar--right': this.props.location === 'right',
      'sidebar--open': this.props.open,
    });

    return (
      <section className={sidebarClass}>
        <button className="sidebar__close" onClick={this.props.close}>Close</button>
        {this.props.children}
      </section>
    );
  }
}

Sidebar.propTypes = {
  location: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default Sidebar;
