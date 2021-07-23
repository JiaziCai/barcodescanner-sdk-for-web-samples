import React, { Component } from "react";
import PropTypes from "prop-types";
import { configure, BarcodePicker as ScanditSDKBarcodePicker } from "scandit-sdk";

// Configure the library and activate it with a license key
const configurationPromise = configure(
  "AXSQtgFYIof8PZzE4S2lCQA2MPRnE2aCcgkWeZUIQFoBPtYNzjUCwA529KutLh1JoAbAD59/vIOxEUsKSWFWBfdA7a33fU9d9wE4/wJ7uWqyVZClTmQ/GaJEoj1FDeWb7RB+ZtEq4V93rlPg93OU9Bb8EE1U5KRIF7Xthfs3EOi+Oivlsq1tBk+7FfZDjN3SuXzGpw4U1GCsOjaimFKswYhk2AhjcgjC0E/dKfqEjPUkxhl3fS9OefvpS9eRQoFyE8vXdc7r35eJgzeEHY9coxOt8cWK3Qvh76iTVPv7cKuN4EPYViCAYpX+WnsBZumPPn1uf9bHnjG4Wbu8qx+VVolZ2Q1anHLTGP2mD3kH6lb8nlb7vHCFFkhorx2PfOuyjrxEeB42+gcaV5XaCnWt7wmUkqslfl6q/2rf66cUaFGjwtOR8lTnvMtiY0eoa0J02+WYsuIIibAOFFkMHkWNu8XIvV2r8RLSV7/jbzO9P0oeRmLLiP7OxHOOxM8wd8yRbg+IpUboS9OGoDW5TwE7kGCEToh/LDOF9YB/6vMrc8wkQKX4bJyhsHuCWeRpxZcHS4+FFLKeMRnxvk00L67LgVqC4Sw1Gc5NuJXIdfkangPwlvVtDZKZ5/z6FP0uAPVptFldZYGyqXGSmOYB2rjqh018KXoiQU4fnt97Z756T2OQuHd72VuRHrLgCfRQ7dmAyzxBKhk1iV3LzdyRI0TcI3spka05amP2WuFcZjXAJU9ng9jrBsYjNyrCYDyE1ZVLmYP+vCQc7SX1m4IrsKiW6H5oPMVEFNG3ZwqbSSWZ69s6Dx3SAZHZmg=="
).catch((error) => {
  alert(error);
});

const style = {
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  margin: "auto",
  maxWidth: "1280px",
  maxHeight: "80%",
};

class BarcodePicker extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    playSoundOnScan: PropTypes.bool,
    vibrateOnScan: PropTypes.bool,
    scanningPaused: PropTypes.bool,
    guiStyle: PropTypes.string,
    videoFit: PropTypes.string,
    scanSettings: PropTypes.object,
    enableCameraSwitcher: PropTypes.bool,
    enableTorchToggle: PropTypes.bool,
    enableTapToFocus: PropTypes.bool,
    enablePinchToZoom: PropTypes.bool,
    accessCamera: PropTypes.bool,
    camera: PropTypes.object,
    cameraSettings: PropTypes.object,
    targetScanningFPS: PropTypes.number,
    onScan: PropTypes.func,
    onError: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    configurationPromise.then(() => {
      ScanditSDKBarcodePicker.create(this.ref.current, this.props).then((barcodePicker) => {
        this.barcodePicker = barcodePicker;
        if (this.props.onScan != null) {
          barcodePicker.on("scan", this.props.onScan);
        }
        if (this.props.onError != null) {
          barcodePicker.on("scanError", this.props.onError);
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.barcodePicker != null) {
      this.barcodePicker.destroy();
    }
  }

  componentDidUpdate(prevProps) {
    // These are just some examples of how to react to some possible property changes

    if (JSON.stringify(prevProps.scanSettings) !== JSON.stringify(this.props.scanSettings)) {
      this.barcodePicker.applyScanSettings(this.props.scanSettings);
    }

    if (prevProps.visible !== this.props.visible) {
      this.barcodePicker.setVisible(this.props.visible);
    }
  }

  render() {
    return <div ref={this.ref} style={style} />;
  }
}

export default BarcodePicker;
