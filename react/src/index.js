import React, { Component } from "react";
import PropTypes from "prop-types";
import { configure, BarcodePicker as ScanditSDKBarcodePicker } from "scandit-sdk";

// Configure the library and activate it with a license key
const configurationPromise = configure(
  "AfUgC9KBRiD5FdlPFQDhBu4V3j5LFKptJ1vjTFs1PlqmNBEP3TWBrPB2OlyDTOuYzW6bVPlu5NbyQVG4gn9Kk9xvf3onMGyp6H0Yo4BZpW+7VRghYy3MaYoWUwfWAcb9AgLicLNFU0jUfz2h9oQ2VJnIHiP7Ge151p6DtIwC8dWbX6TpjxGbkl1Zd7wBw8npayOefTih+xRgrUvxxUzyCx9WNLezLddSUKcdLxOOY6eXuVZHkEiVe2ctgJISpIPxav4UJiZ5GqSzUHwGPLW4Obl3gMqgP5Tzlbx5VT0Tt0z5YUVdLxUHdcZkJ0NWeAL194EfD2qHT8gk3T2m3SK9xDELL0UTsUndGvJ8DsnNzpw/rvbjlyyrdU/Jyeie5g6iyD//ulbiKI4t4BdUVzCjikQD+xy53pF7pvhkcAb+JGhf8PYmCAsDraTkLfnuOzVA9dndK4H1DGnvIXh4Xn/b70Jdw7D7hrGoBLK7VSovSWKFoHXJ1qyH9s/5Ra8+lVHBHbJXCcMWfs6DJ+jYU7TSOWq1SQ0cEzJRM4LFXgpOkn6k4mnJ5bbUnj8NXOAj7f8rXywfLNXeuLr3kwYfRLlkPj8HfB4l6Ncq1Nq22KjovrVc9vOw3dLjrpb39GdKTKkSLi/Gl6mPqwfy4e2mz0fbYmZbTcLNioXnf3qqNsi8p+Q+lvzi3l3HmK9VfkuJ/VZ3pL1E/GekzTZm8M8uxwl1G2VYgYAxO6FyZ6nnbcOJLW7iIeindjlrSZfScKfN5kQREbuBJbFfhnnIeWBdBZcCfkN4e6CROkXZ12vm2yTpy1+9NmPcAQdgeE4="
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
