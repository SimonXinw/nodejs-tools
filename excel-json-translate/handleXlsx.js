import xlsx from 'xlsx';

import { readFile } from 'fs/promises';

export const getExcelJsData = async (config) => {
  /**
   * @param {object} fileUrl
   * absolute  path to fileUrl
   */

  /**
   * @param {string} tableName
   * 工作表名字 tableName
   */

  const fileUrl = config?.fileUrl || './SrcFile/0713_superstore_editor.xlsx';

  const tableName = config?.tableName || null;

  // 获取 本地文件对象
  const fileData = await readFile(fileUrl);

  // 解析 excel 文件
  const workbook = await xlsx.read(fileData, {
    type: 'buffer',
    cellHTML: false,
  });

  const sheetNameList = workbook.SheetNames;

  const _tableName = tableName || sheetNameList[0];

  const jsData = xlsx.utils.sheet_to_json(workbook.Sheets[_tableName]);

  return jsData || null;
};

export const toExcelFile = (config) => {
  const { data, output } = config;

  /**
   * @param {object} data
   * js object, not JSON string
   */

  /**
   * @param {string} output
   * absolute  path to output
   */

  // 1.创建 worksheet
  var worksheet = xlsx.utils.json_to_sheet(data);

  // 2.新建 workbook，然后加入worksheet
  var workbook = xlsx.utils.book_new();

  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');

  // 生成xlsx文件
  xlsx.writeFile(workbook, output);
};
