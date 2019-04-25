import gql from 'graphql-tag';

export const getProduct = gql`
  query getProductByHandle($handle: String!) {
    shop {
      productByHandle(handle: $handle) {
        id
        title
        description
        options {
          name
          values
        }
        variants(first: 250) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
              title
              selectedOptions {
                name
                value
              }
              image(maxWidth: 512) {
                src
              }
              price
              availableForSale
            }
          }
        }
        images(first: 250, maxWidth: 512) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              src
            }
          }
        }
        availableForSale
        tags
      }
    }
  }
`;

export const getProductSet = gql`
  query getCollectionByHandle($handle: String!) {
    shop {
      collectionByHandle(handle: $handle) {
        products(first: 10) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
              title
              description
              options {
                name
                values
              }
              variants(first: 250) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  node {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    image(maxWidth: 512) {
                      src
                    }
                    price
                    availableForSale
                  }
                }
              }
              images(first: 250, maxWidth: 512) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  node {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
