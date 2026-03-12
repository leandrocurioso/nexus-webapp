
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

const formatMySQLDate = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const isValidInt = (str) => {
  const n = Number(str);
  return Number.isSafeInteger(n) && String(n) === str.trim();
};

export {
    toTitleCase,
    formatMySQLDate,
    isValidInt
};