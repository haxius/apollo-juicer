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

describe("buildQuery", () => {
  it("should return a properly formatted GraphQL query", () => {
    const result = buildQuery(productCategories);
    const expected =
      "query productCategories($parent: ID!) {\n" +
      "  productCategories(parent: $parent) {\n" +
      "    id\n" +
      "    title\n" +
      "  }\n" +
      "}";
    expect(result).toBe(expected);
  });
});

describe("combineQueries", () => {
  it("should return a properly formatted GraphQL query", () => {
    const result = combineQueries([productCategories, productTypes]);
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
});
