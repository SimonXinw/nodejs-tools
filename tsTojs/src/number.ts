/**
 * Validates and formats a number to a valid float string.
 */
export const toValidFloat = (input: number | string, maxDecimals?: number): string => {
  // 确保输入为有效数字
  const num = Number(input);

  // 如果不是有效数字，返回空字符串
  if (isNaN(num)) return '';

  if (num % 1 === 0) {
    return num.toString(); // 如果是整数，直接返回
  }

  // 如果提供了 maxDecimals，则按指定的小数位数格式化；否则返回原始的有效位数
  return typeof maxDecimals === 'number'
    ? num.toFixed(maxDecimals) // 格式化为指定的小数位数
    : parseFloat(num.toString()).toString(); // 直接去除无效的小数零
};
