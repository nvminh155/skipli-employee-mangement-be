function compareIgnoreCase(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function includeIgnoreCase(a, b) {
  return a.toLowerCase().includes(b.toLowerCase());
}

module.exports = {
  compareIgnoreCase,
  includeIgnoreCase,
};