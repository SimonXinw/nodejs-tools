var node_xj = require('xls-to-json');
node_xj(
  {
    input: './d9.xlsx', // input xls
    output: './d9.json', // output json
    sheet: 'Sheet1', // specific sheetname
  },
  function (err, result) {
    if (err) {
      console.error('Error>>>>>>>>', err);
    } else {
      console.log('成功>>>>>>>>>.', result);
    }
  }
);
