import { getExcelJsData, toExcelFile } from '../handleXlsx.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const zhixing = async () => {
  const excelAbsolutePath = path.join(
    __dirname,
    './pending-files/0713_superstore_editor.xlsx'
  );

  const outputExcelAbsolutePath = path.join(
    __dirname,
    './0713_superstore_editor_avg_time.xlsx'
  );

  const excelData = await getExcelJsData({
    fileUrl: excelAbsolutePath || '>>>>>>>>>>>>>',
  });

  const VENTURE_ENUM = {
    ID: 'http://sellercenter.lazada.co.id/apps/traffic/superstore',
    SG: 'http://sellercenter.lazada.sg/apps/traffic/superstore',
    VN: 'http://sellercenter.lazada.vn/apps/traffic/superstore',
    PH: 'http://sellercenter.lazada.com.ph/apps/traffic/superstore',
    TH: 'http://sellercenter.lazada.co.th/apps/traffic/superstore',
    MY: 'http://sellercenter.lazada.com.my/apps/traffic/superstore',
  };

  const returnData = [];

  for (let key in VENTURE_ENUM) {
    if (!VENTURE_ENUM.hasOwnProperty(key)) continue;

    let singelVentureData = excelData?.map(
      (item) => item?.url?.includes(VENTURE_ENUM[key]) && item.loadtime
    );

    singelVentureData = singelVentureData?.filter(Boolean);

    const sum = singelVentureData.reduce((acc, cur) => acc + cur, 0);

    const max = Math.max(...singelVentureData);

    const min = Math.min(...singelVentureData);

    const avg = (sum - max - min) / (singelVentureData.length - 2);

    const avg_float_0 = avg?.toFixed(0);

    returnData.push({ venture: key, loadTime: avg_float_0, max, min });
  }

  console.log('>>>>>>>>>>>>>>', returnData);

  toExcelFile({
    data: returnData,
    output: outputExcelAbsolutePath,
  });
};

zhixing();
