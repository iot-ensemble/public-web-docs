module.exports = {
  docs: {
    Introduction: ['introduction/overview', 'introduction/support','introduction/hosting_plans'],
    'Getting Started': [
      'getting-started/setup',
      'getting-started/emulated-data',
      'getting-started/connecting-first-device',
      'getting-started/viewing-device-data',
      'getting-started/connecting-downstream-services',
      'getting-started/buy-and-scale',
    ],
    Tutorials: [
      {
          'ESP32': [
          "tutorials/esp32/arduino-esp32-and-enviro-sensor",
          "tutorials/esp32/esp32-tmp117-fridge-monitor",
          "tutorials/esp32/houseplant-sensor-arduino-esp32",
        ]
      },
      {
          'Phoenix Contact': [
          "tutorials/phoenix-contact/plcnext-to-powerbi",
          "tutorials/phoenix-contact/plcnext-to-grafana-dashboard",
          "tutorials/phoenix-contact/plcnext-to-email-text-alerts",
          "tutorials/phoenix-contact/plcnext-to-azure-machine-learning",
          "tutorials/phoenix-contact/plcnext-to-tableau-dashboard",
        ]
      },
    ],
    Developers: [
      'devs/licenses',
      // 'devs/azure-iot-hub-explained',
      {
        'Device Setup': [
          'devs/device-setup/overview',
          'devs/device-setup/iot-best-practice-schema-explained',
          {
            Connect: [
              //'devs/device-setup/connect/overview',
              'devs/device-setup/connect/http',
              //'devs/device-setup/connect/azure-iot-devices-sdk',
              //'devs/device-setup/connect/device-simulator',
              //'devs/device-setup/connect/rasp-pi-spark-fun',
              //'devs/device-setup/connect/node-red',
            ],
          },
        ],
        'Alerts/Notifications': [
            "devs/alerts/logic-apps",
            "devs/alerts/grafana"
        ],
        'Storage Access': [
          //  'devs/storage/overview',
              'devs/storage/power-bi', 
              'devs/storage/azure-ml',
              'devs/storage/grafana',
              'devs/storage/tableau',
              'devs/storage/sql-server',
        ],
      },
    ],
  },
  api: {
    Introduction: ['api/introduction/overview'],
  },
  drafts: {
    Blogs: ['drafts/template-blog-entry'],
  },
};
