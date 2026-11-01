export function SyntaxError(message) {
  const err = new Error(message);
  err.name = 'SyntaxError';
  return err;
}
SyntaxError.prototype = Object.create(Error.prototype);

export function parse(input) {
  return [];
}

export const StartRules = ['start'];

export default {
  SyntaxError,
  parse,
  StartRules,
};
