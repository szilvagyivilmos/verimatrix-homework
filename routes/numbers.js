var express = require("express");
var router = express.Router();

const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const otherones = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function lessThanTwenty(a, b) {
  if (a === "1") {
    return otherones[b];
  } else {
    return `${tens[a]}${a != 0 && b != 0 ? "-" : ""}${ones[b]}`;
  }
}

function withPostFix(number, postfix) {
  if (number) return `${number} ${postfix}`;
  else return "";
}

router.post("/", async (req, res, next) => {
  if (isNaN(req.body.data.number)) {
    return;
  }
  if (req.body.data.number < 0) {
    res.send({ status: 400, error: Error("Negative Number") });
    return;
  }

  let number = String(req.body.data.number).padStart(5, "0");

  let small = "";
  let large = "";
  let result = "";

  small = lessThanTwenty(number[3], number[4]);

  if (number[0] == 0) {
    if (number[2] == 0) {
      large = withPostFix(ones[number[1]], "thousand");
    } else large = withPostFix(lessThanTwenty(number[1], number[2]), "hundred");
  } else {
    let spacebeetween = number[2] == 0 ? "" : " ";
    large =
      withPostFix(lessThanTwenty(number[0], number[1]), "thousand") +
      spacebeetween +
      withPostFix(ones[number[2]], "hundred");
  }
  let and = "";
  if (large && small) and = " and ";
  result = large + and + small;

  if (number === "00000") result = "zero";

  res.send({ status: 200, data: result });
});

module.exports = router;
