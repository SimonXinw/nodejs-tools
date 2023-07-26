import XLSX from 'xlsx';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataToArray = (data, columnNames) => {
  if (!data) return [];

  if (!columnNames) return [];

  const _data = Object.keys(data)
    ?.map((key) => {
      if (!data.hasOwnProperty(key)) return null;

      return {
        [columnNames.key]: key,
        [columnNames.value]: data[key],
      };
    })
    ?.filter(Boolean);

  return _data || [];
};

export const translateJsToExcel = async (config) => {
  const { entryPath, outputPath } = config || {};

  if (!entryPath || !outputPath) {
    try {
      const dirAbsolutePath = path.join(__dirname, './pending-files/js');

      const outputDirAbsolutePath = path.join(__dirname, './output-files/js');

      const files = fs.readdirSync(dirAbsolutePath);

      const fileName = files && files[0];

      const filePath = path.join(dirAbsolutePath, fileName);

      // 1.读取文件
      const fileDataModule = await import(filePath);

      const fileData = fileDataModule?.default;

      let excelFormatData = []

      if (!Array.isArray(fileData)) {
        excelFormatData = dataToArray(fileData, {
          key: '变量名',
          value: 'spmb key',
        });
      }

      if (Array.isArray(fileData)) {
        excelFormatData = fileData
      }

      console.log('读取成功 - 文件数据>>>>>>>>>>>>>>>', excelFormatData);

      /* 2.创建worksheet */
      var ws = XLSX.utils.json_to_sheet(excelFormatData);

      /* 3.新建空workbook，然后加入worksheet */
      var wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

      const outputFileAbsolutePath = `${outputDirAbsolutePath}/${fileName}.xlsx`;

      /* 4.生成xlsx文件 */
      XLSX.writeFile(wb, outputFileAbsolutePath);

      return '输入文件路径:' + outputFileAbsolutePath;
    } catch (err) {
      console.error('Error >>>>>>>>>>>>>:', err);
    }
  }

  try {
    // 1.读取文件
    const fileDataModule = await import(entryPath);

    const fileData = fileDataModule?.default;

    const excelFormatData = dataToArray(fileData, {
      key: '变量名',
      value: 'spmb key',
    });

    console.log('读取成功 - 文件数据>>>>>>>>>>>>>>>', excelFormatData);

    /* 2.创建worksheet */
    var ws = XLSX.utils.json_to_sheet(excelFormatData);

    /* 3.新建空workbook，然后加入worksheet */
    var wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    const outputFileAbsolutePath = outputPath + '.xlsx';

    /* 4.生成xlsx文件 */
    XLSX.writeFile(wb, outputFileAbsolutePath);
  } catch (err) {
    console.error('Error >>>>>>>>>>>>>:', err);
  }
};

const entryFileAbsolutePath = path.join(
  __dirname,
  './pending-files/js/spmb.js'
);

const outputFileAbsolutePath = path.join(
  __dirname,
  './output-files/js/spmb2.js'
);

translateJsToExcel();
