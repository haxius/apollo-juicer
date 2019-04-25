import { buildQuery, combineQueries } from "../index.js";

const productCategories = {
  name: "productCategories",
  alias: "category",
  variables: [
    {
      type: "ID!",
      name: "parent"
    }
  ],
  results: ["id", "title"]
};

const productCategoryFields = `
  fragment productCategoryFields on ProductCategory {
    id
    title
  }
`;

const productCategoryExtraFields = `
  fragment productCategoryExtraFields on ProductCategory {
    tags
    links
  }
`;

const productCategoriesWithFragments = {
  name: "productCategories",
  alias: "category",
  variables: [
    {
      type: "ID!",
      name: "parent"
    }
  ],
  results: ["...productCategoryFields"],
  fragments: [productCategoryFields]
};

const productCategoriesWithMultipleFragments = {
  ...productCategoriesWithFragments,
  results: ["...productCategoryFields", "...productCategoryExtraFields"],
  fragments: [productCategoryFields, productCategoryExtraFields]
};

const productCategoriesWithoutVariables = {
  ...productCategories,
  variables: undefined
};

const productTypeFields = `
  fragment productTypeFields on ProductType {
    id
    title
  }
`;

const productTypeExtraFields = `
  fragment productTypeExtraFields on ProductType {
    tags
    links
  }
`;

const productTypes = {
  name: "productTypes",
  alias: "type",
  variables: [
    {
      type: "ID!",
      name: "parent"
    }
  ],
  results: ["id", "title"]
};

const productTypesWithFragments = {
  name: "productTypes",
  alias: "type",
  variables: [
    {
      type: "ID!",
      name: "parent"
    }
  ],
  results: ["...productTypeFields"],
  fragments: [productTypeFields]
};

const productTypesWithMultipleFragments = {
  ...productTypesWithFragments,
  results: ["...productTypeFields", "...productTypeExtraFields"],
  fragments: [productTypeFields, productTypeExtraFields]
};

describe("buildQuery", () => {
  it("should return a properly formatted GraphQL query", () => {
    const result = buildQuery(productCategories, { omitGql: true });
    const expected =
      "query productCategories($parent: ID!) {\n" +
      "  productCategories(parent: $parent) {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n" +
      "}";
    expect(result).toBe(expected);
  });

  it("should return a properly formatted GraphQL query without variables", () => {
    const result = buildQuery(productCategoriesWithoutVariables, { omitGql: true });
    const expected =
      "query productCategories {\n" +
      "  productCategories {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n" +
      "}";
    expect(result).toBe(expected);
  });

  it("should return a properly formatted GraphQL query with fragment", () => {
    const result = buildQuery(productCategoriesWithFragments, {
      omitGql: true
    });
    const expected =
      "query productCategories($parent: ID!) {\n" +
      "  productCategories(parent: $parent) {\n" +
      "    ...productCategoryFields\n" +
      "  }\n" +
      "}\n" +
      "  fragment productCategoryFields on ProductCategory {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n";
    expect(result).toBe(expected);
  });

  it("should return a properly formatted GraphQL query with multiple fragments", () => {
    const result = buildQuery(productCategoriesWithMultipleFragments, {
      omitGql: true
    });
    const expected =
      "query productCategories($parent: ID!) {\n" +
      "  productCategories(parent: $parent) {\n" +
      "    ...productCategoryFields\n" +
      "    ...productCategoryExtraFields\n" +
      "  }\n" +
      "}\n" +
      "  fragment productCategoryFields on ProductCategory {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n\n\n" +
      "  fragment productCategoryExtraFields on ProductCategory {\n" +
      "    tags\n" +
      "    links\n" +
      "  }\n";
    expect(result).toBe(expected);
  });

  it("should return a gql tagged query without error", () => {
    buildQuery(productCategories);
  });
});

describe("combineQueries", () => {
  it("should return a properly formatted GraphQL query", () => {
    const result = combineQueries([productCategories, productTypes], {
      omitGql: true
    });
    const expected =
      "query combined($categoryParent: ID!, $typeParent: ID!) {\n" +
      "productCategories(parent: $categoryParent) {\n" +
      "  id\n" +
      "  title\n" +
      "}\n" +
      "productTypes(parent: $typeParent) {\n" +
      "  id\n" +
      "  title\n" +
      "}\n" +
      "}";
    expect(result).toBe(expected);
  });

  it("should return a properly formatted GraphQL query with fragments from each dataset", () => {
    const result = combineQueries(
      [productCategoriesWithFragments, productTypesWithFragments],
      {
        omitGql: true
      }
    );
    const expected =
      "query combined($categoryParent: ID!, $typeParent: ID!) {\n" +
      "productCategories(parent: $categoryParent) {\n" +
      "  ...productCategoryFields\n" +
      "}\n" +
      "productTypes(parent: $typeParent) {\n" +
      "  ...productTypeFields\n" +
      "}\n" +
      "}\n" +
      "  fragment productTypeFields on ProductType {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n\n\n" +
      "  fragment productCategoryFields on ProductCategory {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n";
    expect(result).toBe(expected);
  });

  it("should return a properly formatted graphql query with multiple fragments from each dataset", () => {
    const result = combineQueries(
      [
        productCategoriesWithMultipleFragments,
        productTypesWithMultipleFragments
      ],
      {
        omitGql: true
      }
    );
    const expected =
      "query combined($categoryParent: ID!, $typeParent: ID!) {\n" +
      "productCategories(parent: $categoryParent) {\n" +
      "  ...productCategoryFields\n" +
      "  ...productCategoryExtraFields\n" +
      "}\n" +
      "productTypes(parent: $typeParent) {\n" +
      "  ...productTypeFields\n" +
      "  ...productTypeExtraFields\n" +
      "}\n" +
      "}\n" +
      "  fragment productTypeFields on ProductType {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n\n\n" +
      "  fragment productTypeExtraFields on ProductType {\n" +
      "    tags\n" +
      "    links\n" +
      "  }\n\n\n" +
      "  fragment productCategoryFields on ProductCategory {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n\n\n" +
      "  fragment productCategoryExtraFields on ProductCategory {\n" +
      "    tags\n" +
      "    links\n" +
      "  }\n";
    expect(result).toBe(expected);
  });

  it("should return a gql tagged query without error", () => {
    combineQueries([productCategories, productTypes]);
  });
});
