import React from 'react';
import { Query } from 'react-apollo';
import { getProduct } from '../queries';
import Product from './Product';

const pathArray = window.location.pathname.split('/');
const handleUrl = pathArray[pathArray.length - 1];

const QuerySimple = () => (
  // Render for simple product
  <Query query={getProduct} variables={{ handle: handleUrl }}>
    {({ loading, error, data }) => {
      if (loading) return <p className="loading">Loading...</p>;
      if (error) return <p>GraphQL Error: {error}</p>;
      const product = data.shop.productByHandle;
      return <Product product={product} options={product.options} />;
    }}
  </Query>
);

export default QuerySimple;
