const path = require("path");
const fs = require("fs");

const inputArguments = process.argv.slice(2);

const text = inputArguments.join(" ");

const timeStamp = new Date().toIsoString();


const message = `${text} ${timeStamp} \n`


if (!message) {
  console.log("❌ Please provide a message to log");
  console.log("Example : node index.js Hello World!");
  process.exit(1);
}

const filePath = path.join(__dirname, "log.txt");

fs.appendFile(filePath, message, { encode: "utf-8" }, () => {
  console.log("Your log added successfully");
});

console.log(filePath);
