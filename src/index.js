// @flow
import gql from "graphql-tag";

import {
  type Query,
  capitalize,
  body,
  wrapper as externalWrapper
} from "./query";

type Options = {
  wrapper?: boolean,
  omitGql: boolean
};

export const buildQuery = (
  { name, alias, variables = [], fragments = [], results }: Query,
  { wrapper = true, omitGql = false }: Options = {}
): mixed => {
  const queryBody = body({
    name,
    alias,
    variables,
    fragments,
    results,
    wrapper
  });

  const queryWrapper = externalWrapper({ name, variables, fragments });
  const result = !wrapper ? queryBody : queryWrapper(queryBody);

  return !!omitGql
    ? result
    : gql`
        ${result}
      `;
};

export const combineQueries = (
  queries: [],
  { omitGql = false }: Options = {}
): mixed => {
  const combinedVariables = [];
  let combinedFragments = [];

  for (const { alias, variables = [] } of queries) {
    for (const { name, type } of variables) {
      combinedVariables.push({
        name: `${alias}${capitalize(name)}`,
        type
      });
    }
  }

  for(const { fragments = [] } of queries) {
    combinedFragments = fragments.concat(combinedFragments);
  }

  const combinedQueries = queries.map(query =>
    buildQuery(query, { wrapper: false, omitGql: true })
  );

  const queryWrapper = externalWrapper({
    name: "combined",
    variables: combinedVariables,
    fragments: combinedFragments
  });

  const result = queryWrapper(combinedQueries.join("\n"));

  return !!omitGql
    ? result
    : gql`
        ${result}
      `;
};
