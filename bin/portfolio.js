#!/usr/bin/env node

/**
 * Given no parameters, return the latest portfolio value per token in USD
    Given a token, return the latest portfolio value for that token in USD
     Given a date, return the portfolio value per token in USD on that date
     Given a date and a token, return the portfolio value of that token in USD on that date

 */

const yargs = require("yargs");
var fs = require("fs");
const papa = require("papaparse");
const axios = require("axios");
require("dotenv").config();

const options = yargs
  .usage("Usage: -n <name>")
  .option("t", {
    alias: "token",
    describe: "return the latest portfolio value for that token in USD",
    type: "string",
    //demandOption: true,
  })
  .option("d", {
    alias: "date",
    describe: "return the portfolio value per token in USD on that date",
    type: "string",
  }).argv;

//read csv
var transactions = []; //array to hold all parsed transactions from csv

var BTCvalues = [];
var ETHvalues = [];
var XRPvalues = [];

const dataStream = fs.createReadStream(__dirname + "/data/testdata.csv");

const option = {
  worker: true,
  header: true,
  dynamicTyping: true,
};
const parseStream = papa.parse(papa.NODE_STREAM_INPUT, option);

dataStream.pipe(parseStream);

parseStream.on("data", (chunk) => {
  //console.log(chunk);
  transactions.push(chunk);
});

parseStream.on("finish", async () => {
  console.table(transactions);
  console.log(transactions.length);

  if (!options.date) {
    transactions.map((trans) => {
      //================BTC==============
      if (trans.token == "BTC") {
        if (trans.transaction_type == "WITHDRAWAL") {
          BTCvalues.push(pos_to_neg(trans.amount));
        }
        if (trans.transaction_type == "DEPOSIT") {
          BTCvalues.push(Number(trans.amount));
        }
      }
      //==============ETH==============
      if (trans.token == "ETH") {
        if (trans.transaction_type == "WITHDRAWAL") {
          ETHvalues.push(pos_to_neg(trans.amount));
        }
        if (trans.transaction_type == "DEPOSIT") {
          ETHvalues.push(Number(trans.amount));
        }
      }
      //================XRP===============
      if (trans.token == "XRP") {
        if (trans.transaction_type == "WITHDRAWAL") {
          XRPvalues.push(pos_to_neg(trans.amount));
        }
        if (trans.transaction_type == "DEPOSIT") {
          XRPvalues.push(Number(trans.amount));
        }
      }
    });
  }

  /**
   * Given no parameters, return the latest portfolio value per token in USD
   */

  if (!options.token && !options.date) {
    //console.log("====BTC VALUES=====", BTCvalues);
    const BTCsum = BTCvalues.reduce((a, b) => a + b, 0);
    const USDBTC = await toUSD(BTCsum, "BTC");
    //console.log("====ETH VALUES=====", ETHvalues);
    const ETHsum = ETHvalues.reduce((a, b) => a + b, 0);
    const USDETH = await toUSD(ETHsum, "ETH");

    //console.log("====XRP VALUES=====", XRPvalues);
    const XRPsum = XRPvalues.reduce((a, b) => a + b, 0);
    const USDXRP = await toUSD(XRPsum, "XRP");

    console.log("BTC", USDBTC);
    console.log("ETH", USDETH);
    console.log("XRP", USDXRP);
  }

  /**
   *  Given a token, return the latest portfolio value for that token in USD
   */

  if (options.token && !options.date) {
    let token = options.token.toUpperCase();
    if (token == "BTC") {
      const BTCsum = BTCvalues.reduce((a, b) => a + b, 0);
      console.log("TOTAL BTC", BTCsum);
      const USDBTC = await toUSD(BTCsum, "BTC");
      console.log("TOTAL BTC", USDBTC);
    }

    if (token == "ETH") {
      const ETHsum = ETHvalues.reduce((a, b) => a + b, 0);
      console.log("TOTAL ETH", ETHsum);
      const USDETH = await toUSD(ETHsum, "ETH");
      console.log("TOTAL ETH", USDETH);
    }

    if (token == "XRP") {
      const XRPsum = XRPvalues.reduce((a, b) => a + b, 0);
      console.log("TOTAL XRP", XRPsum);
      const USDXRP = await toUSD(XRPsum, "XRP");
      console.log("TOTAL XRP in USD", USDXRP);
    }
  }

  /**
   *
   * Given a date, return the portfolio value per token in USD on that date
   *
   *                               OR
   *
   * Given a date and a token, return the portfolio value of that token in USD on that date
   *
   */

  if (options.date) {
    let date = options.date;
    console.log("request date", date);
    transactions.map((trans) => {
      //================BTC==============
      let newDate = formatTimestamp(trans.timestamp);
      //console.log("formated date", newDate);
      //console.log("request date", date);

      if (trans.token == "BTC" && newDate == date) {
        if (trans.transaction_type == "WITHDRAWAL") {
          BTCvalues.push(pos_to_neg(trans.amount));
        }
        if (trans.transaction_type == "DEPOSIT") {
          BTCvalues.push(Number(trans.amount));
        }
      }
      //==============ETH==============
      if (trans.token == "ETH" && trans.timestamp == date) {
        if (trans.transaction_type == "WITHDRAWAL") {
          ETHvalues.push(pos_to_neg(trans.amount));
        }
        if (trans.transaction_type == "DEPOSIT") {
          ETHvalues.push(Number(trans.amount));
        }
      }
      //================XRP===============
      if (trans.token == "XRP" && trans.timestamp == date) {
        if (trans.transaction_type == "WITHDRAWAL") {
          XRPvalues.push(pos_to_neg(trans.amount));
        }
        if (trans.transaction_type == "DEPOSIT") {
          XRPvalues.push(Number(trans.amount));
        }
      }
    });

    if (!options.token) {
      //console.log("====BTC VALUES=====", BTCvalues);
      const BTCsum = BTCvalues.reduce((a, b) => a + b, 0);
      const USDBTC = await toUSD(BTCsum, "BTC");
      //console.log("====ETH VALUES=====", ETHvalues);
      const ETHsum = ETHvalues.reduce((a, b) => a + b, 0);
      const USDETH = await toUSD(ETHsum, "ETH");

      //console.log("====XRP VALUES=====", XRPvalues);
      const XRPsum = XRPvalues.reduce((a, b) => a + b, 0);
      const USDXRP = await toUSD(XRPsum, "XRP");

      console.log("BTC", USDBTC);
      console.log("ETH", USDETH);
      console.log("XRP", USDXRP);
    } else {
      if (options.token.toUpperCase() == "BTC") {
        const BTCsum = BTCvalues.reduce((a, b) => a + b, 0);
        const USDBTC = await toUSD(BTCsum, "BTC");
        console.log("BTC", USDBTC);
      }

      if (options.token.toUpperCase() == "ETH") {
        const ETHsum = ETHvalues.reduce((a, b) => a + b, 0);
        const USDETH = await toUSD(ETHsum, "ETH");
        console.log("ETH", USDETH);
      }

      if (options.token.toUpperCase() == "XRP") {
        const XRPsum = XRPvalues.reduce((a, b) => a + b, 0);
        const USDXRP = await toUSD(XRPsum, "XRP");
        console.log("XRP", USDXRP);
      }
    }
  }
});

/**================UTILITIES============ */

//negates postive values
function pos_to_neg(num) {
  return -Math.abs(num);
}

//convert to usd
async function toUSD(amount, originSymbol) {
  //call crypto compare
  const url = process.env.url + `&fsym=${originSymbol}&tsyms=USD`;
  try {
    const { data: response } = await axios.get(url);
    console.log("conversion rate USD", response.USD);
    USDvalue = amount * response.USD;
    return USDvalue;
  } catch (error) {
    console.log("Coversion error", error);
  }
}

function formatTimestamp(timestamp) {
  var timetodate = new Date(timestamp);
  //console.log(timetodate);
  (month = "" + (timetodate.getMonth() + 1)),
    (day = "" + timetodate.getDate()),
    (year = timetodate.getFullYear());

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
