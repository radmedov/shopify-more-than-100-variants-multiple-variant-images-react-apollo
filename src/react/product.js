import axios from 'axios';

export function addVariantToCart(variantId, quantity) {
  axios
    .post(`/cart/add.js`, { quantity, id: parseInt(variantId) })
    .then(res => {
      // TODO: Handle response
      // console.log(res);
      console.log(res.data);
    });
}

// Show selected variant by variant ID from URL
export function handleVariantUrl(product) {
  if (window.location.search) {
    const variantUrlArr = window.location.search.split('=');
    const variantIdFromUrl = variantUrlArr[1];
    const encodedVariantIdFromUrl = btoa(
      `gid://shopify/ProductVariant/${variantIdFromUrl}`
    );
    const selectedVariantFromUrl = product.variants.edges.find(
      variant => variant.node.id === encodedVariantIdFromUrl
    ).node;
    const colorSelect = document.querySelector('select[data-name="color"]');
    const sizeSelect = document.querySelector('select[data-name="size"]');
    colorSelect.value = selectedVariantFromUrl.selectedOptions[0].value;
    sizeSelect.value = selectedVariantFromUrl.selectedOptions[1].value;
    // Create the event.
    const ev = document.createEvent('Event');
    // Define that the event name is 'build'.
    ev.initEvent('change', true, true);
    colorSelect.dispatchEvent(ev);
    sizeSelect.dispatchEvent(ev);
  }
}
// Decode the variant ID from GraphQL
export function decodeVariantID(encode) {
  const arr = atob(encode).split('/');
  const variant = arr[arr.length - 1];
  return variant;
}
