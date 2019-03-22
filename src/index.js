// @flow
import {
  type Query,
  capitalize,
  body,
  wrapper as externalWrapper
} from "./query";

export const buildQuery = (
  { name, alias, variables, results }: Query,
  wrapper: boolean = true
): string => {
  const queryBody = body({
    name,
    alias,
    variables,
    results,
    wrapper
  });

  const queryWrapper = externalWrapper({ name, variables });

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

  const combinedQueries = queries.map(query => buildQuery(query, false));

  const queryWrapper = externalWrapper({
    name: "combined",
    variables: combinedVariables
  });

  return queryWrapper(combinedQueries.join("\n"));
};
