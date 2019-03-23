// @flow
import gql from "graphql-tag";

import {
  type Query,
  capitalize,
  body,
  wrapper as externalWrapper
} from "./query";

export const buildQuery = (
  { name, alias, variables, results }: Query,
  wrapper: boolean = true,
  omitGql: boolean = false
): mixed => {
  const queryBody = body({
    name,
    alias,
    variables,
    results,
    wrapper
  });

  const queryWrapper = externalWrapper({ name, variables });
  const result = !wrapper ? queryBody : queryWrapper(queryBody);

  return !!omitGql
    ? result
    : gql`
        ${result}
      `;
};

export const combineQueries = (
  queries: [],
  omitGql: boolean = false
): mixed => {
  const combinedVariables = [];

  for (const { alias, variables } of queries) {
    for (const { name, type } of variables) {
      combinedVariables.push({
        name: `${alias}${capitalize(name)}`,
        type
      });
    }
  }

  const combinedQueries = queries.map(query => buildQuery(query, false, true));

  const queryWrapper = externalWrapper({
    name: "combined",
    variables: combinedVariables
  });

  const result = queryWrapper(combinedQueries.join("\n"));

  return !!omitGql
    ? result
    : gql`
        ${result}
      `;
};
