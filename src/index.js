//@flow
import body from "./body";
import capitalize from "./capitalize";
import externalWrapper from "./wrapper";

type Query = {
  name: string,
  alias: string,
  variables: [],
  results: []
};

export const buildQuery = (
  { name, alias, variables, results }: Query,
  wrapper: boolean = true
): string => {
  let queryBody = body({
    name,
    alias,
    variables,
    results,
    wrapper
  });

  let queryWrapper = externalWrapper({ name, variables });

  return !wrapper ? queryBody : queryWrapper(queryBody);
};

export const combineQueries = (queries: []): string => {
  const combinedVariables = [];

  for (const { alias, variables } of queries) {
    for (const { name, type } of variables) {
      combinedVariables.push({
        name: `${alias}${capitalize(name)}`,
        type
      });
    }
  }

  const combinedQueries = queries.map(query =>
    buildQuery(query, false)
  );

  const queryWrapper = externalWrapper({
    name: "combined",
    variables: combinedVariables
  });

  return queryWrapper(combinedQueries.join("\n"));
};
