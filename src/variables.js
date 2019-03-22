//@flow
export default (items: []) => {
  let result = items.map(({ type, name }) => `$${name}: ${type}`);
  return result.join(", ");
};
