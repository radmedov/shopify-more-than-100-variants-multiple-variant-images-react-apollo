import 'react-app-polyfill/ie9';
import '@babel/polyfill';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import { focusHash, bindInPageLinks } from '@shopify/theme-a11y';
import { cookiesEnabled } from '@shopify/theme-cart';
// React
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import App from '../../react/components/App';
// Apollo client setup
const httpLink = createHttpLink({
  uri: 'https://YOUR_STORE_NAME.myshopify.com/api/graphql',
});
const middlewareLink = setContext(() => ({
  headers: {
    'X-Shopify-Storefront-Access-Token': 'YOUR_ACCESS_TOKEN',
  },
}));
const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache({
    cacheRedirects: {
      Query: {
        productByHandle: (_, args, { getCacheKey }) =>
          getCacheKey({ id: args.handle, __typename: 'ProductConnection' }),
        collectionByHandle: (_, args, { getCacheKey }) =>
          getCacheKey({ id: args.handle, __typename: 'Collection' }),
      },
    },
  }),
});

if (window.location.pathname.indexOf('product') > -1) {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('MainContent')
  );
}

// Common a11y fixes
focusHash();
bindInPageLinks();

// Apply a specific class to the html element for browser support of cookies.
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies'
  );
}
// Hide annoying shopify preview bar
window.addEventListener('load', function() {
  setTimeout(function() {
    const shopifyFrame = document.getElementById('preview-bar-iframe');
    shopifyFrame.style.display = 'none';
  }, 1000);
});
