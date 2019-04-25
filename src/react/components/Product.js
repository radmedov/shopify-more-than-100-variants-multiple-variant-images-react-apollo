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
    const { product, options } = this.props;
    console.log('Product: ', product);
    this.setState({
      selectedOptions: {
        [options[0].name]: options[0].values[0],
        [options[1].name]: options[1].values[0],
      },
      selectedVariant: product.variants.edges[0].node,
      selectedVariantId: decodeVariantID(product.variants.edges[0].node.id),
      isSizeAvailable: true,
      selectedSize: product.variants.edges[0].node.selectedOptions[1].value,
    });
  }

  componentDidMount() {
    const { product } = this.props;
    handleVariantUrl(product);
  }

  handleOptionChange(event) {
    const { product } = this.props;
    const { target } = event;
    const { selectedOptions } = this.state;
    selectedOptions[target.name] = target.value;
    const selectedVariantNode = product.variants.edges.find(variant =>
      variant.node.selectedOptions.every(
        selectedOption =>
          selectedOptions[selectedOption.name] === selectedOption.value
      )
    );

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
        // eslint-disable-next-line react/no-unused-state
        selectedSize: selectedVariant.selectedOptions[1].value,
      });
    } else {
      const { selectedSize } = this.state;
      const sizeSelect = document.querySelector('select[data-name="size"]');
      this.setState({
        isSizeAvailable: false,
      });
      // Create the event.
      const ev = document.createEvent('Event');
      // Define that the event name is 'build'.
      ev.initEvent('change', true, true);
      const size = selectedSize;
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
    const { options, product } = this.props;
    const {
      selectedVariantImage,
      selectedVariant,
      selectedVariantQuantity,
      isSizeAvailable,
      selectedVariantId,
    } = this.state;

    const placeholder = 'https://picsum.photos/200/300?image=0';
    let variantImage = '';
    if (product.images.edges[0] === undefined) {
      variantImage = placeholder;
    } else {
      variantImage = selectedVariantImage || product.images.edges[0].node.src;
    }

    // GEt variant images only. More than 1
    const variantImages = product.images.edges.map(edge => edge.node.src);
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

    const variant = selectedVariant || product.variants.edges[0].node;
    const variantQuantity = selectedVariantQuantity || 1;
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
            alt={`${product.title}-featured`}
          />
          <div className="thumbs__wrapper">
            {imageGroup.map((image, index) => {
              if (image !== variantImage) {
                return (
                  <img
                    className="product__thumb"
                    key={image}
                    src={image}
                    alt={`${product.title}-${index}`}
                  />
                );
              }
              return false;
            })}
          </div>
        </div>

        <div className="product__data">
          <h1>{product.title}</h1>
          <span className="product__price">${variant.price}</span>
          {variantSelectors}
          {!isSizeAvailable && <p>This size is not available</p>}
          <input
            className="input__quantity"
            min="1"
            type="number"
            defaultValue={variantQuantity}
            onChange={this.handleQuantityChange}
          />
          {selectedVariant.availableForSale && isSizeAvailable ? (
            <button
              className="product__buy--button"
              type="button"
              onClick={() =>
                addVariantToCart(selectedVariantId, variantQuantity)
              }
            >
              ADD TO BAG
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
