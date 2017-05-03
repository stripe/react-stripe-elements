// @flow
import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  children?: any,
};
type State = {
  registeredElements: Array<{type: string, element: ElementShape}>,
};
type Context = {
  stripe: StripeShape,
};

export default class Elements extends React.Component {
  static childContextTypes = {
    elements: PropTypes.object.isRequired,
    registerElement: PropTypes.func.isRequired,
    unregisterElement: PropTypes.func.isRequired,
    registeredElements: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      element: PropTypes.object.isRequired,
    })).isRequired,
  }
  static contextTypes = {
    stripe: PropTypes.object.isRequired,
  }

  constructor(props: Props, context: Context) {
    super(props, context);

    const {children, ...options} = this.props;
    this._elements = this.context.stripe.elements(options);

    this.state = {
      registeredElements: [],
    };
  }
  state: State

  getChildContext() {
    return {
      elements: this._elements,
      registerElement: this.handleRegisterElement,
      unregisterElement: this.handleUnregisterElement,
      registeredElements: this.state.registeredElements,
    };
  }
  props: Props
  context: Context
  _elements: ElementsShape

  handleRegisterElement = (type: string, element: Object) => {
    this.setState({
      registeredElements: [...this.state.registeredElements, {type, element}],
    });
  }

  handleUnregisterElement = (el: Object) => {
    this.setState({
      registeredElements: this.state.registeredElements.filter(({element}) => element !== el),
    });
  }

  render() {
    return React.Children.only(this.props.children);
  }
}