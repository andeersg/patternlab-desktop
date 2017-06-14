import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Modal extends Component {
  render() {
    if (!this.props.showModal) {
      return null;
    }

    return (
      <section className="modal">
        <div className="modal__content">{this.props.children}</div>
        <div className="modal__backdrop" role="button" onClick={this.props.hide} />
      </section>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  hide: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};

export default Modal;
