const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const houses = JSON.parse(fs.readFileSync("./houses.json"));

const fields = [
  "title",
  "location",
  "price",
  "stars",
  "numReviews",
  "url",
  {
    label: "habitaciones",
    value: (row, field) => {
      return row["conforts"]["habitaciones"] || field.default;
    },
    default: "null",
  },
  {
    label: "camas",
    value: (row, field) => {
      return row["conforts"]["camas"] || field.default;
    },
    default: "null",
  },
  {
    label: "baños",
    value: (row, field) => {
      return row["conforts"]["baños"] || field.default;
    },
    default: "null",
  },
];

const json2csvParse = new Parser({ fields });
const csv = json2csvParse.parse(houses);

fs.writeFileSync(path.join(__dirname, "houses.csv"), csv);
