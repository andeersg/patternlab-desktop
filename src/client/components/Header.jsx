import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <h1 className="header__title">Header application</h1>
      </header>
    );
  }
}

Header.propTypes = {
  projects: PropTypes.arrayOf({}).isRequired,
};

export default Header;
