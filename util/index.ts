import { DownExcelTs } from "./type";

/**
 * TreeNode data with format
 * @param {*} data
 * @param {*} formatFn
 * @return {*}
 */
export function formatTreeData(data, formatFn) {
  if (!data || data.length === 0) return [];
  return data.map((x) => {
    const { children } = x;
    if (formatFn && typeof formatFn === "function") {
      return {
        ...formatFn(x),
        children: formatTreeData(children, formatFn),
      };
    }

    return x;
  });
}

/**
 * Download excel file
 * @param {*} response
 * @return {*} Void
 */
export const downExcel: DownExcelTs = (response, name) => {
  const link = document.createElement("a");

  const blob = new Blob([response?.data], {
    type: "application/vnd.ms-excel",
  });

  link.style.display = "none";

  link.href = URL.createObjectURL(blob);

  const _name = response.headers["content-disposition"]?.split("=")[1];

  link.download = name || _name;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};
