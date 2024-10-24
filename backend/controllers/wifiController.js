const wifi = require("node-wifi");

const checkWifiConnection = async (req, res) => {
  try {
    const currentConnection = await wifi.getCurrentConnections();
    // console.log("currentConnection", currentConnection[0]);

    if (currentConnection.length > 0) {
      const currentSSID = currentConnection[0].bssid;
      // console.log("currentSSID", currentSSID);

      const specificWiFI = process.env.WUP_WIFI_SSID;

      if (currentSSID === specificWiFI) {
        return res.status(200).json({
          status: true,
          data: currentConnection[0],
          errors: [],
        });
      } else {
        return res.status(401).json({
          status: false,
          data: [],
          errors: { message: "Connected to a different Wi-Fi network." },
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        data: [],
        errors: { message: "No Wi-Fi connection detected." },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, data: [], errors: { message: error.message } });
  }
};

module.exports = {
  checkWifiConnection,
};
