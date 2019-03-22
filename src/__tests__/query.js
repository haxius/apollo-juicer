import {
  capitalize,
  args,
  vars,
  body,
  wrapper,
  results,
  result
} from "../query.js";

/**
 * Testing all methods of Query script.
 */

describe("capitalize", () => {
  it("should properly capitalize the first character of a word", () => {
    const input = "dog";
    const expected = "Dog";
    const result = capitalize(input);
    expect(result).toBe(expected);
  });
});

describe("args", () => {
  it("should process args into a graphql valid argument list", () => {
    const input = [
      {
        name: "parent",
        type: "ID!"
      },
      {
        name: "title",
        type: "string"
      }
    ];
    const expected = "$parent: ID!, $title: string";
    const result = args(input);
    expect(result).toBe(expected);
  });
});

describe("vars", () => {
  const input = [
    {
      name: "parent",
      type: "ID!"
    },
    {
      name: "title",
      type: "string"
    }
  ];

  it("should process variables into a graphql valid query input", () => {
    const expected = "parent: $parent, title: $title";
    const result = vars({ variables: input, wrapper: true });
    expect(result).toBe(expected);
  });

  it("should produce camelCase variables when no wrapper is present", () => {
    const expected = "parent: $dogParent, title: $dogTitle";
    const result = vars({ variables: input, alias: "dog", wrapper: false });
    expect(result).toBe(expected);
  });
});

describe("body", () => {
  const input = {
    name: "categories",
    alias: "category",
    variables: [
      {
        name: "parent",
        type: "ID!"
      },
      {
        name: "title",
        type: "string"
      }
    ],
    results: ["id", "title"],
    wrapper: true
  };

  it("should produce a syntatically correct graphql dataset", () => {
    const expected =
      "  categories(parent: $parent, title: $title) {\n" +
      "    id\n" +
      "    title\n" +
      "  }";
    const result = body(input);
    expect(result).toBe(expected);
  });

  it("should produce a proper nested dataset with camelCase arguments", () => {
    const expected =
      "categories(parent: $categoryParent, title: $categoryTitle) {\n" +
      "  id\n" +
      "  title\n" +
      "}";
    const result = body({ ...input, wrapper: false });
    expect(result).toBe(expected);
  });
});

describe("wrapper", () => {
  it("should produce a syntactically correct graphql query wrapper", () => {
    const input = {
      name: "categories",
      variables: [
        {
          name: "parent",
          type: "ID!"
        },
        {
          name: "title",
          type: "string"
        }
      ]
    };
    const expected = "query categories($parent: ID!, $title: string) {\nfoo\n}";
    const intermediate = wrapper(input);
    const result = intermediate("foo");
    expect(result).toBe(expected);
  });
});

describe("results", () => {
  it("should produce a syntactically correct list of expected results for a query", () => {
    const expected = "id\ntitle";
    const result = results(["id", "title"], "");
    expect(result).toBe(expected);
  });
  it("should produce a properly indented list of expected results for a list", () => {
    const expected = " id\n title";
    const result = results(["id", "title"], " ");
    expect(result).toBe(expected);
  });
  it("should produce a properly nested list of expected results for a list", () => {
    const expected = "id\ntitle\nlayers {\n  id\n  title\n}";
    const result = results(
      ["id", "title", { name: "layers", results: ["id", "title"] }],
      ""
    );
    expect(result).toBe(expected);
  });
  it("should produce a properly nested AND INDENTED list of expected results for a list", () => {
    const expected = " id\n title\n layers {\n   id\n   title\n }";
    const result = results(
      ["id", "title", { name: "layers", results: ["id", "title"] }],
      " "
    );
    expect(result).toBe(expected);
  });
});

describe("result", () => {
  it("should return a string if item is a string", () => {
    const input = "dog";
    const expected = "dog";
    const actual = result(input, "");
    expect(actual).toBe(expected);
  });
  it("should return a graphql resultset if the item is an object", () => {
    const input = { name: "layers", results: [ "id", "title" ] };
    const expected = "layers {\n  id\n  title\n}";
    const actual = result(input, "");
    expect(actual).toBe(expected);
  });
});