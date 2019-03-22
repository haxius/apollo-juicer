// @flow
export const queryResults = (items: [], indent: string): string => {
  let results = [];

  for (let item of items) results.push(queryResult(item, indent));

  return results.join("\n");
};

export const queryResult = (
  item: string | { name: string, results: [] },
  indent: string
): string => {
  let result;

  if ("object" === typeof item) {
    result = `${indent}${item.name} {\n${queryResults(
      item.results,
      `  ${indent}`
    )}\n${indent}}`;
  } else {
    result = indent + item;
  }

  return result;
};

export default queryResults;
