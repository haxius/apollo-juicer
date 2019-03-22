// @flow
import applied from "./applied";
import results from "./results";

type Query = {
  name: string,
  alias: string,
  variables: [],
  results: [],
  wrapper: boolean
};

export default ({
  name,
  alias,
  variables,
  results: suppliedResults,
  wrapper
}: Query) => {
  const appliedVariables = applied({
    variables,
    alias,
    wrapper
  });

  const indent = !wrapper ? "" : "  ";
  const queryResults = results(suppliedResults, `  ${indent}`);

  return `${indent}${name} (${appliedVariables}) {\n${queryResults}\n${indent}}`;
};
