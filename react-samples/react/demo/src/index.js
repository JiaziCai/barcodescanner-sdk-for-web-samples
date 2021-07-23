import React, { Component } from "react";
import { render } from "react-dom";
import { ScanSettings, Barcode } from "scandit-sdk";
import axios from "axios";

import BarcodePicker from "../../src";

class Demo extends Component {
  render() {
    const returnData = async (eventId, attendeeId) => {
      try {
        return await axios
          .get(`https://api.crowdpass.co/user/getattendeeeventlink?eventId=${eventId}&attendeeId=${attendeeId}`)
          .then((res) => {
            if (res.data.success) {
              return res.data.attendeeEventLink.attendeeId;
            }
          });
      } catch (error) {
        return null;
      }
    };

    return (
      <BarcodePicker
        playSoundOnScan={true}
        vibrateOnScan={true}
        scanSettings={
          new ScanSettings({
            enabledSymbologies: ["qr", "ean8", "ean13", "upca", "upce", "code128", "code39", "code93", "itf"],
            codeDuplicateFilter: 1000,
          })
        }
        onScan={async (scanResult) => {
          let result = await returnData(681, 59923);
          let baseUrl = scanResult.barcodes[0].data;
          let paraUrl = baseUrl.indexOf("check/");
          let newSlice = baseUrl.slice(paraUrl + 6);
          let attendeeId = newSlice.slice(0, newSlice.indexOf("/"));
          let eventId = newSlice.slice(newSlice.indexOf("/") + 1, newSlice.length - 1);
          console.log(attendeeId, "attendeeid");
          console.log(eventId, "eventid");
          document.getElementById("scandit-barcode-result").innerHTML = scanResult.barcodes.reduce(function (
            string,
            barcode,
            index = result
          ) {
            // alert(barcode.data);
            console.log(result, "reult");
            // return result;
            return string + Barcode.Symbology.toHumanizedName(barcode.symbology) + ": " + result + "<br>";
          },
          "");
        }}
        onError={(error) => {
          console.error(error.message);
        }}
      />
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
