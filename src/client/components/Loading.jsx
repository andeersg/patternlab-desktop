import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Loading extends Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    const action = this.props.message;


    return (
      <section className="loading">
        <div className="loading__box">
          <img src="assets/pl.svg" alt="" />
          <h1 className="loading__title">Loading</h1>
          <p>{action}</p>
        </div>
      </section>
    );
  }
}

Loading.defaultProps = {
  show: false,
  message: 'Working on stuff',
};

Loading.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string,
};

export default Loading;
