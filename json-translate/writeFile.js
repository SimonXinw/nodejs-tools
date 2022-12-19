const fs = require("fs");

// create a JSON object
const user = {
  id: 1,
  name: "John Doe",
  age: 22,
};

// convert JSON object to string
const data = JSON.stringify(user, null, 4);

// write JSON string to a file
try {
  fs.writeFileSync("new.json", data);
  console.log("JSON data is saved.");
} catch (error) {
  console.error(err);
}
