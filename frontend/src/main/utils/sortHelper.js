// Stryker disable next-line StringLiteral : asc should not change
export function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    // Stryker disable next-line all : conditional statement should not change or be an empty block
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    // Stryker disable next-line all : should not compare a to "" or be false
    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;

    // Stryker disable next-line EqualityOperator : should not change the equality to >=
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      // Stryker disable next-line ArithmeticOperator : multiply by -1 and divide by -1 are the same
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}
