import React from 'react';
import { Query } from 'react-apollo';
import { getProductSet } from '../queries';
import Product from './Product';

const merge = require('deepmerge');

const pathArray = window.location.pathname.split('/');
const handleUrl = pathArray[pathArray.length - 1];

const QueryExt = () => (
  // Render for extended product
  <Query query={getProductSet} variables={{ handle: handleUrl }}>
    {({ loading, error, data }) => {
      if (loading) return <p className="loading">Loading...</p>;
      if (error) return <p>GraphQL Error: {error}</p>;
      const products = data.shop.collectionByHandle.products.edges;
      // console.log(products);
      // Merge all products in collection into 1 product
      const mergedProducts = merge.all(products);
      // console.log('Merged products: ', mergedProducts);
      const optionsArr = mergedProducts.node.options;
      const options = [
        ...optionsArr
          .reduce(function(m, o) {
            const { name } = o;
            const obj = m.get(name);
            return obj
              ? m.set(name, {
                  name,
                  values: [...new Set(obj.values.concat(o.values))],
                })
              : m.set(name, o);
          }, new Map())
          .values(),
      ];
      return <Product product={mergedProducts.node} options={options} />;
    }}
  </Query>
);

export default QueryExt;
