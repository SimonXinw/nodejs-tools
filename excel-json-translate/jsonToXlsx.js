/* 需要导出的JSON数据 */

const XLSX = require("xlsx");
const fs = require("fs");
// eg:
var eg = [
  {
    Field: "a2c_1d",
    Name: "a2c pv L1D",
    Rule: "between(value)~(value)",
    Priority: "P0",
  },
  {
    Field: "a2c_uv_1d",
    Name: "a2c uv L1D",
    Rule: "between(value)~(value)",
    Priority: "P0",
  },
  {
    Field: "search_a2c_gmv_L1D",
    Name: "search a2c gmv L1D",
    Rule: "between(value)~(value)",
    Priority: "P0",
  },
  {
    Field: "paid_gmv_1d",
    Name: "item gmv L1D",
    Rule: "between(value)~(value)",
    Priority: "P0",
  },
  {
    Field: "positive_seller_rating",
    Name: "positive seller rating",
    Rule: "between(0)~(100)",
    Priority: "P0",
  },
  {
    Field: "is_vchr_available",
    Name: "If vourcher is avaliable or not",
    Rule: "include：yes/no",
    Priority: "P0",
  },
];
// 1.读取文件
fs.readFile("./file/d9.json", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }
  data = JSON.parse(data);

  console.log("读取成功 - 文件数据>>>>>>>>>>>>>>>", data);

  /* 2.创建worksheet */
  var ws = XLSX.utils.json_to_sheet(data);

  /* 3.新建空workbook，然后加入worksheet */
  var wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "People");

  /* 生成xlsx文件 */
  XLSX.writeFile(wb, "./xlsx/d9.xlsx");
});
