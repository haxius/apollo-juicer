//@flow
import variables from "./variables";

type Query = {
  name: string,
  variables: []
};

export default ({ name, variables: suppliedVariables }: Query) => {
  const queryVariables = variables(suppliedVariables);
  return (contents: string) => `query ${name}(${queryVariables}) {\n${contents}\n}`;
};
