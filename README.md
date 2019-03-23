# 🥭 apollo-juicer 🥭

Create simple reusable GraphQL queries.

## Table of Contents

- [Installation](#installation)
- [Explanation](#explanation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

`npm i @parhelion/apollo-juicer`

## Building
```
git clone git@github.com:haxius/apollo-juicer.git
yarn install
yarn run build
```
Note: If you wish to see a non-minified and obfuscated compile use
`yarn run build-dev`
## Testing / Linting
```
<...git clone and yarn install>
yarn run test
yarn run lint
```

## Explanation

Traditionally GraphQL queries and mutations dot a modern application.
Sometimes they are organized neatly into folders and other times they can be sporatically placed.
When changes happen to the queries from the server-side this can result in multiple locations needing updates on the client-side.
`apollo-juicer` attempts to recitfy this by providing a common-root in which one can derive queries.

Traditional example:
```
file: graphql/products.js

export const PRODUCTS = gql`
    query products($category: ID) {
        products(category: $category) {
            name
            price
        }
    }
`;

export const PRODUCT_TYPES = gql`
    query productTypes {
        productTypes {
            name
        }
    }
`;
```

Using Apollo it is reasonable to assume that one might consume either of these queries using the Query component:
```
<Query query={PRODUCT_TYPES}>...</Query>

or

<Query query={PRODUCTS} variables={{ category: "1234" }}>...</Query>
```

With traditional Apollo if one wanted a component to consume both queries one would either nest a query (ouch), or more properly
combine the queries with a special query:
```
export const PRODUCTS_WITH_TYPES = gql`
    query productsWithTypes($category: ID) {
        products(category: $category) {
            name
            price
        }
        productTypes {
            name
        }
    }
`;
```

The problem with this is the duplication of work, and duplication of queries. If a change is made on the API one now has more than one place to fix it.
Now one could partially rectify this by exporting strings from their GraphQL Files like such:
```
file: graphql/products.js

export const PRODUCTS = `
    products(category: $category) {
        name
        price
    }
`;

export const PRODUCT_TYPES = `
    productTypes {
        name
    }
`;
```

Then when they wish to consume it they could do something like this:
```
export const PRODUCTS_WITH_TYPES = gql`
    query productsWithTypes ($category ID) {
        ${PRODUCTS}
        ${PRODUCT_TYPES}
    }
`;
```
But what happens when one or more of those data sets have duplicate arguments?

```
file: graphql/products.js

export const PRODUCTS = `
    products(category; $category) {
        name
        price
    }
`;

export const PRODUCT_TYPES = `
    productTypes(category: $category) {
        name
    }
`;
````
One would need a solution that would provide unique naming for the arguments and connect the pieces so the output would look like this:
```
export const PRODUCTS_WITH_TYPES = gql`
    query productsWithTypes($productCategory: ID, $typeCategory: ID) {
        products(category: $productCategory) {
            name
            price
        }
        productTypes(category: $typeCategory) {
            name
        }
    }
`;
```
Queue `apollo-juicer`.

## Usage

There are two methods exported by `apollo-juicer`.


1) [`buildQuery(<query>)`](#buildquery)
2) [`combineQueries([<query>, <query>, ...]])`](#combinequeries)

The output of which should be self explanatory.

## buildQuery

In order to use these methods, one has to construct their queries (currently) as JavaScript objects.

The `PRODUCTS` query mentioned above would be exported instead as follows:
```
file: graphql/products.js

export const PRODUCTS = {
    name: "products",
    alias: "product",
    variables: [{ name: "parent", type: "ID" }],
    results: ["name", "price"]
};

export const PRODUCT_TYPES = {
    name: "productTypes",
    alias: "type",
    variables: [{ name: "parent", type: "ID" }],
    results: [ "name" ]
};
```

Now it's the users choice when or how they want to convert this into an actual `gql` query. One could export it wrapped or wrap it on import (preferred) but all that is neccessary to convert it into a usable query is:
```
import { buildQuery } from "@parhelion/apollo-juicer";
import { PRODUCTS } from "./graphql/products.js";

const PRODUCTS_QUERY = buildQuery(PRODUCTS);

...

inSomeComponentsRenderMethod() {
    return (
        <Query query={PRODUCTS_QUERY} variables={{ parent: "1234" }}>
            ...
        </Query>
    )
}
```

How does this benefit the developer? Did we not just add another layer to constructing a GraphQL query?
Enter `combineQueries()`

## combineQueries

Using the example again from above:
```
file: graphql/products.js

export const PRODUCTS = `
    products(category; $category) {
        name
        price
    }
`;

export const PRODUCT_TYPES = `
    productTypes(category: $category) {
        name
    }
`;
````

If one wishes to combine multiple queries together without needing to:
* worry about duplicate argument names
* write a third query

```
import { buildQuery } from "@parhelion/apollo-juicer";
import { PRODUCTS, PRODUCT_TYPES } from "./graphql/products.js";

const PRODUCTS_QUERY = combineQueries([PRODUCTS, PRODUCT_TYPES]);

...

inSomeComponentsRenderMethod() {
    return (
        <Query query={PRODUCTS_QUERY} variables={{ productParent: "1234", typeParent: "5678" }}>
            ...
        </Query>
    )
}
```

Behind the scenes, the query that is generated would look something like this:
```
query combined($productCategory: ID, $typeCategory: ID) {
    products(category: $productCategory) {
        name
        price
    }
    productTypes(category: $typeCategory) {
        name
    }
}
```
Wasn't that much cleaner?
* `apollo-juicer` uses the query alias to construct deduped arguments
* `PRODUCT` and `PRODUCT_TYPES` are now re-usable
** That is to say, one could combine them in many different areas of the app in many different ways with other query objects without ever needing to rewrite the query.
** In addition to that, if the GraphQL definition for `products` or `productTypes` changes, one only has to update the code in one place.


## Support

Please [open an issue](https://github.com/haxius/apollo-juicer/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/haxius/apollo-juicer/compare/).
