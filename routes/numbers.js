var express = require("express");
var router = express.Router();

//Constants, padded leading empty strings for exact indexing
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

//Parse numbersto string
function notWholeTens(a, b) {
  //Custom english numbering 11-19
  if (a === "1") {
    return otherones[b];
  } 
  //Basic numbers with dash
  else {
    return `${tens[a]}${a != 0 && b != 0 ? "-" : ""}${ones[b]}`;
  }
}

//Adding postfixes with correct amount of spaces
//prefix spaces could be added in a different function
function withPostFix(number, postfix) {
  if (number) return `${number} ${postfix}`;
  else return "";
}

router.post("/", async (req, res, next) => {
  try {
    let input = req.body.data.number;
    //Validating input
    if (isNaN(input)) {
      throw Error("Not a Number");
    }
    if (input < 0) {
      throw Error("Negative Number");
    }
    if(input.length>5){
      throw Error("Out of Range, max is 99,999")
    }

    //Addig leading zeros
    let number = String(input).padStart(5, "0");

    let small = "";
    let large = "";
    let result = "";

    //Parsing the last two numbers, 'tens'
    small = notWholeTens(number[3], number[4]);

    //Parsing the first 3 numbers, 'hundreds/thousands'
    //chacing leading 0 if the thousands or the hundreds get the tens format
    if (number[0] == 0) {
      //Whole thousand
      if (number[2] == 0) {
        large = withPostFix(ones[number[1]], "thousand");
      } 
      //hundreds
      else
        large = withPostFix(notWholeTens(number[1], number[2]), "hundred");
    } else {
      //Extra space if thousands and hundreds are presented
      let spacebeetween = number[2] == 0 ? "" : " ";
      large =
        withPostFix(notWholeTens(number[0], number[1]), "thousand") +
        spacebeetween +
        withPostFix(ones[number[2]], "hundred");
    }
    //Extra space and merging
    let and = "";
    if (large && small) and = " and ";
    result = large + and + small;

    //Seting result for zero input
    if (number === "00000") result = "zero";

    //Sending response
    res.send({ status: 200, data: result });
  } catch (err) {
    //Sending Error response
    return res.status(400).send(err.message);
  }
});

module.exports = router;
