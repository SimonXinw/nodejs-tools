# toExcelFile

## 作用

将内存中的 **对象数组** 写入指定路径的 Excel 文件（单 sheet，名称为 `sheet1`）。

## 参数（config）

- `data`：行对象数组（非 JSON 字符串）。
- `output`：输出文件的绝对或相对路径。

## 实现说明

内部使用 `xlsx.utils.json_to_sheet` → `book_new` → `book_append_sheet` → `writeFile`。

## 注意

大表时注意内存占用；列顺序由首行对象的键顺序推断。
