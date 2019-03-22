// @flow
import capitalize from "./capitalize";

type Query = {
  variables: [],
  alias: string,
  wrapper: boolean
};

export default ({ variables, alias, wrapper }: Query): string => {
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
