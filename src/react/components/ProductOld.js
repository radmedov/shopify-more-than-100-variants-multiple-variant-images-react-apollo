/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VariantSelector from './VariantSelector';
import {
  addVariantToCart,
  handleVariantUrl,
  decodeVariantID,
} from '../product';

class Product extends Component {
  static propTypes = {
    options: PropTypes.array,
    product: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      selectedOptions: {
        [this.props.options[0].name]: this.props.options[0].values[0],
        [this.props.options[1].name]: this.props.options[1].values[0],
      },
      selectedVariant: this.props.product.node.variants.edges[0].node,
      selectedVariantId: decodeVariantID(
        this.props.product.node.variants.edges[0].node.id
      ),
      isSizeAvailable: true,
    });
  }

  componentDidMount() {
    handleVariantUrl(this.props.product.node);
  }

  handleOptionChange(event) {
    const target = event.target;
    const selectedOptions = this.state.selectedOptions;
    selectedOptions[target.name] = target.value;
    const selectedVariantNode = this.props.product.node.variants.edges.find(
      variant =>
        variant.node.selectedOptions.every(
          selectedOption =>
            selectedOptions[selectedOption.name.toLowerCase()] ===
            selectedOption.value
        )
    );
    console.log(selectedVariantNode);
    if (selectedVariantNode !== undefined) {
      const selectedVariant = selectedVariantNode.node;
      // Add variant ID to url. Imitate default Shopify behavior
      const decodedVariantId = decodeVariantID(selectedVariant.id);
      window.history.pushState(null, null, `?variant=${decodedVariantId}`);
      this.setState({
        selectedVariant,
        selectedVariantImage: selectedVariant.image.src,
        selectedVariantId: decodedVariantId,
        isSizeAvailable: true,
        selectedSize: selectedVariant.selectedOptions[1].value,
      });
    } else {
      const sizeSelect = document.querySelector('select[data-name="size"]');
      this.setState({
        isSizeAvailable: false,
      });
      // Create the event.
      const ev = document.createEvent('Event');
      // Define that the event name is 'build'.
      ev.initEvent('change', true, true);
      const size = this.state.selectedSize;
      setTimeout(function() {
        sizeSelect.value = size;
        sizeSelect.dispatchEvent(ev);
      }, 1000);
    }
  }

  handleQuantityChange(event) {
    this.setState({
      selectedVariantQuantity: event.target.value,
    });
  }

  render() {
    const { options } = this.props;
    const { product } = this.props;

    const placeholder = 'https://picsum.photos/200/300?image=0';
    let variantImage = '';
    if (this.props.product.node.images.edges[0] === undefined) {
      variantImage = placeholder;
    } else {
      variantImage =
        this.state.selectedVariantImage ||
        this.props.product.node.images.edges[0].node.src;
    }

    // GEt variant images only. More than 1
    const variantImages = this.props.product.node.images.edges.map(
      edge => edge.node.src
    );
    const variantImageSplit = variantImage.split('/');
    const variantImagePart = variantImageSplit[variantImageSplit.length - 1];
    const variantImageName = variantImagePart
      .split('_')
      .slice(0, 2)
      .join('_');
    // console.log(variantImageName);
    const imageGroup = variantImages.filter(image =>
      image.includes(variantImageName)
    );
    // console.log(imageGroup);

    const variant =
      this.state.selectedVariant || product.node.variants.edges[0].node;
    const variantQuantity = this.state.selectedVariantQuantity || 1;
    const variantSelectors = options.map(option => (
      <VariantSelector
        handleOptionChange={this.handleOptionChange}
        key={option.name}
        option={option}
      />
    ));
    return (
      <div className="product__wrapper">
        <div className="product__images">
          <img
            className="featured__image"
            src={variantImage}
            alt={product.node.title}
          />
          <div className="thumbs__wrapper">
            {imageGroup.map(image => {
              if (image !== variantImage) {
                return (
                  <img
                    className="product__thumb"
                    key={image}
                    src={image}
                    alt={product.node.title}
                  />
                );
              }
              return false;
            })}
          </div>
        </div>

        <div className="product__data">
          <h1>{product.node.title}</h1>
          <span className="product__price">${variant.price}</span>
          {variantSelectors}
          {!this.state.isSizeAvailable && <p>This size is not available</p>}
          <input
            className="input__quantity"
            min="1"
            type="number"
            defaultValue={variantQuantity}
            onChange={this.handleQuantityChange}
          />
          {this.state.selectedVariant.availableForSale ? (
            <button
              className="product__buy--button"
              type="button"
              onClick={() =>
                addVariantToCart(this.state.selectedVariantId, variantQuantity)
              }
            >
              ADD TO CART
            </button>
          ) : (
            <button
              className="product__buy--button btn__disabled"
              type="button"
            >
              SOLD OUT
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Product;
