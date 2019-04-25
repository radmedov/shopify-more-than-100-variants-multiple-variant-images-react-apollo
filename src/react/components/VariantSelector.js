import React, { Component } from 'react';
import PropTypes from 'prop-types';

class VariantSelector extends Component {
  static propTypes = {
    option: PropTypes.object,
    handleOptionChange: PropTypes.func,
  };

  render() {
    const { option, handleOptionChange } = this.props;
    return (
      <select
        className="product__option"
        name={option.name}
        key={option.name}
        onChange={handleOptionChange}
        data-name={option.name.toLowerCase()}
      >
        {option.values.map(value => (
          <option
            value={value}
            key={`${option.name}-${value}`}
          >{`${value}`}</option>
        ))}
      </select>
    );
  }
}

export default VariantSelector;
