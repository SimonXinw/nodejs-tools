const toValidFloat = (input, maxDecimals) => {
  const num = Number(input);
  if (isNaN(num)) return "";
  if (num % 1 === 0) {
    return num.toString();
  }
  return typeof maxDecimals === "number" ? num.toFixed(maxDecimals) : parseFloat(num.toString()).toString();
};
export {
  toValidFloat
};
