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
              return res.data.attendeeEventLink;
            }
          });
      } catch (error) {
        return null;
      }
    };

    const returnAttendeeData = async (attendeeId) => {
      try {
        return await axios.get(`https://api.crowdpass.co/user/getattendee/${attendeeId}`).then((res) => {
          if (res.data.success) {
            return res.data.attendeeInfo;
          }
        });
      } catch (error) {
        return null;
      }
    };

    const returnCheckIn = async (eventId, attendeeId) => {
      try {
        return await axios({
          url: `https://api.crowdpass.co/user/checkin`,
          method: "post",
          data: {
            attendeeId: attendeeId,
            eventId: eventId,
            checkin: 1,
          },
        }).then((res) => {
          if (res.data.success) {
            return res.data.attendeeEventLink.checkin;
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
          let baseUrl = scanResult.barcodes[0].data;
          let paraUrl = baseUrl.indexOf("check/");
          let newSlice = baseUrl.slice(paraUrl + 6);
          let attendeeId = newSlice.slice(0, newSlice.indexOf("/"));
          let eventId = newSlice.slice(newSlice.indexOf("/") + 1, newSlice.length - 1);
          console.log(attendeeId, "attendeeid");
          console.log(eventId, "eventid");
          let { checkin } = await returnData(eventId, attendeeId);
          let { firstName, lastName, attendeeEmail } = await returnAttendeeData(attendeeId);
          let finalResult;
          if (checkin == null) {
            finalResult = await returnCheckIn(eventId, attendeeId);
          } else {
            finalResult = false;
          }
          document.getElementById("scandit-barcode-result").innerHTML = scanResult.barcodes.reduce(function (
            string,
            barcode
          ) {
            // alert(barcode.data);
            // return result;
            finalResult = finalResult == true ? "Successfully checked in" : "Not valid for check in";
            return (
              string +
              Barcode.Symbology.toHumanizedName(barcode.symbology) +
              ": " +
              finalResult +
              " " +
              firstName +
              " " +
              lastName +
              " " +
              attendeeEmail +
              "<br>"
            );
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
