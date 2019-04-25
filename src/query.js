// @flow
export type Query = {
  name?: string,
  alias?: string,
  variables: [],
  results?: [],
  fragments?: string[],
  wrapper?: boolean
};

export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const args = (items: []) => {
  const result = items.map(({ type, name }) => `$${name}: ${type}`);
  return result.join(", ");
};

export const vars = ({ variables, alias = "", wrapper }: Query): string => {
  let result;

  if (!wrapper) {
    result = variables.map(
      ({ name }) => `${name}: $${alias}${capitalize(name)}`
    );
  } else {
    result = variables.map(({ name }) => `${name}: $${name}`);
  }

  return result.join(", ");
};

export const body = ({
  name = "",
  alias = "",
  variables,
  results: suppliedResults = [],
  wrapper
}: Query) => {
  const appliedVariables = vars({
    variables,
    alias,
    wrapper
  });

  const indent = !wrapper ? "" : "  ";
  const queryResults = results(suppliedResults, `  ${indent}`);

  return appliedVariables.length
    ? `${indent}${name}(${appliedVariables}) {\n${queryResults}\n${indent}}`
    : `${indent}${name} {\n${queryResults}\n${indent}}`;
};

export const wrapper = ({
  name = "",
  variables: suppliedVariables,
  fragments: suppliedFragments
}: Query) => {
  const queryVariables = args(suppliedVariables);
  const queryFragments = fragments(suppliedFragments);

  return (contents: string) =>
    queryVariables.length
      ? `query ${name}(${queryVariables}) {\n${contents}\n}${queryFragments}`
      : `query ${name} {\n${contents}\n}${queryFragments}`;
};

export const result = (
  item: string | { name: string, results: [] },
  indent: string
): string => {
  let result;

  if (typeof item === "object") {
    result = `${indent}${item.name} {\n${results(
      item.results,
      `  ${indent}`
    )}\n${indent}}`;
  } else {
    result = indent + item;
  }

  return result;
};

export const results = (items: [], indent: string): string => {
  const results = [];

  for (const item of items) results.push(result(item, indent));

  return results.join("\n");
};

export const fragment = (item: string): string => `${item}`;

export const fragments = (items: string[] = []): string => {
  const results = [];

  for (const item of items) results.push(fragment(item));

  return results.join("\n");
};
