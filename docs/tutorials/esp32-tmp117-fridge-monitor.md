---
title: Arduino ESP32 Board with High Precision TMP117 Temperature Sensor Tutorial
hide_title: true
sidebar_label: ESP32 / Temperature Sensor
keywords:
    - iot
    - azure
    - connect a device
    - iot hub
    - support
    - temperature
    - monitor
    - tutorial
hide_table_of_contents: true
---

## Arduino ESP32 Board with High Precision TMP117 Temperature Sensor Tutorial

In this tutorial, we will be taking a generic ESP32 board and the following items to create an IoT device to monitor temperature.
### Things you will need
- [SparkFun Thing Plus - ESP32 WROOM Board](https://www.sparkfun.com/products/15663)
- A [Qwiic Cable](https://www.sparkfun.com/products/14426) (Any length is fine for this tutorial)
- Your computer/laptop
- A Micro-USB cable to connect the ESP32 to your computer
- [SparkFun Qwiic High Precision Temperature Sensor - TMP117](https://www.sparkfun.com/products/15805)
- [Arduino IDE](https://www.arduino.cc/en/software) installed on your computer
- A [Fathym IoT Ensemble](https://www.iot-ensemble.com/dashboard) account (we’re using the free, shared version)

## Installing Arduino IDE and Necessary Software
Next, we will need to install all of the required software/libraries on your computer

### Installing Arduino IDE
Download your version of Arudino IDE [here](https://www.arduino.cc/en/software). Follow all of the steps in the wizard to complete installation (You can keep all of the default options the same)

### Add Sensor Library
Once that is complete, we need to install the sensor library. Click the following link to download the zipped library folder <br></br>

[Download the SparkFun TMP117 Library (ZIP)](https://github.com/sparkfun/SparkFun_TMP117_Arduino_Library/archive/master.zip)  

Once downloaded, go to your Arduino IDE screen. In the top toolbar, select **Sketch** -> **Include Library** -> **Add .ZIP Library**, as shown below:

![Add .Zip Library](/img/screenshots/add-zip-library.png)
<br></br>

This will open a file browser. Navigate to your downloaded package, select the zip folder and click "Open".

### Add ESP32 Board Definition

In order for us to work with the ESP32, we need to add a board "definition". 

1. Copy the following link:
    > https://dl.espressif.com/dl/package_esp32_index.json

2. Back in your Arduino IDE, in the top toolbar, click **File** -> **Preferences**. You will be taken to the follow screen:

![Add Board Definition](/img/screenshots/add-board-definition.png)

Take the link from the previous step and paste it into the "Additional Boards Manager URLs" field (highlighted above in red). Click "OK"

3. Next, in the top toolbar, click **Tools** -> **Board: "Name of Board"** -> **Boards Manager...**, as shown below:

![Open Boards Manager](/img/screenshots/boards-manager.png)

In the next screen, type "esp32" into the search bar. A board definition with the same name will appear, click "Install", then click "Close" (as shown below)

![ESP32 Board Definition](/img/screenshots/esp32-board-definition.png)

4. Next, navigate to **Tools** -> **Board: "Name of Board"** -> **ESP32 Arduino** and select **Adafruit ESP32 Feather**, as shown below:

![Select Board Definition](/img/screenshots/select-board-definition.png)


## Determine Communication Port Number

Now that we have all the necessary libraries and dependencies, we need to tell Arduino IDE which port to use to communicate with your ESP32. 

1. **Before plugging in the ESP32 to your computer**, click **Tools** -> **Port** in the top toolbar of Arduino IDE. This will display a list of ports that are currently being used. Generally, there will only be one or two ports listed, depending on what you have plugged into your computer. Take note of the ports in this list. The picture below shows a list of ports **before** the ESP32 board is plugged in. 

![Ports Before Plugging In](/img/screenshots/com-port-before.png)

2. Next, plug your ESP32 board directly into one of your computer's USB ports. After this, follow the previous step to view the list of available ports. You should now see an additional port that wasn't in the list before. This is the port that your ESP32 board is using. Click the port to select it. In the picture below, "COM3" is the port that is new in the list.

![Ports After Plugging In](/img/screenshots/found-com-port.png)

## Get Code Onto your ESP32 board

Now that your Arduino can talk to your ESP32, it's time to put some code on your board! 

First, copy the following code:
```C
/**
 * A simple example using an ESP32 board with a CCS811/BME280 sensor and connecting to the cloud with IoT Ensemble
 */
#include <Wire.h>
#include <WiFi.h>
#include "Esp32MQTTClient.h"
#include <SparkFun_TMP117.h> // Used to send and recieve specific information from our sensor

#define INTERVAL 30000 //Time interval for sending messages in ms
#define MESSAGE_MAX_LEN 512

// These are the four values that need to be filled out. NOTE: ESP32 boards can only connect to 2.4GHz networks, they can NOT connect to 5Ghz networks///////
const char* ssid     = "Your Wifi Name (SSID)";
const char* password = "Your Wifi Password";
static const char* connectionString = "Your Connection String";
char DeviceID[] = "Your DeviceID";
//////////////////////////////////////////////////////////////

char deviceVersion[] = "0.0.1";
char deviceType[] = "ESP32";
char latitude[] = "40.7578";
char longitude[] = "-104.9733";
const char *messageData = "{\"DeviceID\":\"%s\", \"DeviceType\":\"%s\", \"Version\":\"%s\", \"DeviceData\": {\"Latitude\":%s, \"Longitude\":%s}, \"SensorReadings\": {\"TemperatureF\":%f, \"TemperatureC\":%f}, \"SensorMetadata\": {\"_\": {\"SignalStrength\": 1}}}";
static bool hasIoTHub = false;
static bool hasWifi = false;
int messageCount = 1;
static bool messageSending = true;
static uint64_t send_interval_ms;

{
  if (result == IOTHUB_CLIENT_CONFIRMATION_OK)
  {
TMP117 sensor; // Initalize sensor

static void SendConfirmationCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result)
    Serial.println("Send Confirmation Callback finished.");
  }
}

static void MessageCallback(const char* payLoad, int size)
{
  Serial.println("Message callback:");
  Serial.println(payLoad);
}

static void DeviceTwinCallback(DEVICE_TWIN_UPDATE_STATE updateState, const unsigned char *payLoad, int size)
{
  char *temp = (char *)malloc(size + 1);
  if (temp == NULL)
  {
    return;
  }
  memcpy(temp, payLoad, size);
  temp[size] = '\0';
  // Display Twin message.
  Serial.println(temp);
  free(temp);
}

static int  DeviceMethodCallback(const char *methodName, const unsigned char *payload, int size, unsigned char **response, int *response_size)
{
  LogInfo("Try to invoke method %s", methodName);
  const char *responseMessage = "\"Successfully invoke device method\"";
  int result = 200;

  if (strcmp(methodName, "start") == 0)
  {
    LogInfo("Start sending temperature and humidity data");
    messageSending = true;
  }
  else if (strcmp(methodName, "stop") == 0)
  {
    LogInfo("Stop sending temperature and humidity data");
    messageSending = false;
  }
  else
  {
    LogInfo("No method %s found", methodName);
    responseMessage = "\"No method found\"";
    result = 404;
  }

  *response_size = strlen(responseMessage) + 1;
  *response = (unsigned char *)strdup(responseMessage);

  return result;
}

void setup() {
  Serial.println("ESP32 Device");
  Serial.println("TMP117 Read Example");  
  
  Wire.begin();//initialize I2C bus
  Serial.begin(115200);
  Wire.setClock(400000);

  if (sensor.begin() == true) // Function to check if the sensor will correctly self-identify with the proper Device ID/Address
  {
    Serial.println("Begin");
  }
  else
  {
    Serial.println("Device failed to setup- Freezing code.");
    while (1); // Runs forever
  } 
  
  Serial.println("Initializing...");
  Serial.println(" > WiFi");
  Serial.println("Starting connecting WiFi.");
  
  delay(10);
  WiFi.begin(ssid, password);  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    hasWifi = false;
  }
  hasWifi = true;
  
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  Serial.println(" > IoT Hub");
  if (!Esp32MQTTClient_Init((const uint8_t*)connectionString, true))
  {
    hasIoTHub = false;
    Serial.println("Initializing IoT hub failed.");
    return;
  }
  hasIoTHub = true;
  
  Esp32MQTTClient_SetSendConfirmationCallback(SendConfirmationCallback);
  Esp32MQTTClient_SetMessageCallback(MessageCallback);
  Esp32MQTTClient_SetDeviceTwinCallback(DeviceTwinCallback);
  Esp32MQTTClient_SetDeviceMethodCallback(DeviceMethodCallback);
  Serial.println("Start sending events.");
  randomSeed(analogRead(0));
  send_interval_ms = millis();

}

void loop() {
if (hasWifi && hasIoTHub)
  {
    if (messageSending && 
        (int)(millis() - send_interval_ms) >= INTERVAL)
    {
      
      char messagePayload[MESSAGE_MAX_LEN];

      float tempC = sensor.readTempC();
      float tempF = sensor.readTempF();
      
      snprintf(messagePayload, MESSAGE_MAX_LEN, messageData, deviceId, deviceType, deviceVersion, latitude, longitude, tempF, tempC);
      Serial.println(messagePayload);
      EVENT_INSTANCE* message = Esp32MQTTClient_Event_Generate(messagePayload, MESSAGE);
      Esp32MQTTClient_SendEventInstance(message);
      send_interval_ms = millis();
    }
    else
    {
      Esp32MQTTClient_Check();
    }
  }
  delay(10);
}
```
<br></br>

Next, in the ArduinoIDE, delete the existing template code. Then, paste the code you just copied.

Before we can continue, we need to register your ESP32 device with Iot Ensemble

## Configuring IoT Ensemble

Before we can tell your device where to send data, we first need somewhere to send the data.  There are multiple ways this can be accomplished, with IoT Ensemble the focus is helping you leverage best practice cloud IoT technology.  Here we'll be using the Azure IoT Hub to connect devices to a shared data flow, and then make it available downstream for use in other applications.

Follow the following steps to create a new device in IoT Ensemble. For more details on the full IoT Ensemble experience, check out our [full documentation](../getting-started/connecting-first-device).

Start by navigating to the [IoT Ensemble Dashboard](https://www.iot-ensemble.com/dashboard) and sign in or sign up.  For the purposes of moving forward, you will only need the Free license and no credit card will be required.

### Enroll a Device

In the **Connected Devices** section, click the **Enroll New Device** button, provide a name for your device (i.e. my-first-device) and click **Enroll Device**.  That’s it!  Your device is now registered and should be visible in the dashboard, along with its associated connection string.

![Dashboard device list first device](/img/screenshots/dashboard-device-list-first-device.png)

Click on the <img src="/img/screenshots/icon-copy.png" class="text-image" /> button to copy your connection string to your clipboard. Your connection string should look something like this:

> HostName=**YourHostName**;DeviceId=**YourDeviceID**;SharedAccessKey=**YourDeviceKey**

In addition to the whole connection string, there is one key part that we need: the **YourDeviceID** portion. This value needs to be a part of the data payload. Let's add them now.


## Configure the Code

Back in the Arduino IDE, near the top of the code, you should see a section of four values that need to be filled in, like this:

![Values to Fill In](/img/screenshots/arduino-fill-in-values.png)

First, fill in the WiFi name and password of the network you plan on using.

> ### **Please Note!**
> With this particular ESP32 board, it can only connect to 2.4 Ghz Wifi networks. The board **CAN NOT** connect to 5 Ghz networks. If you attempt to connect to a 5 Ghz network, this code will not work.

Next, take your connection string from IoT Ensemble and paste it into the "connectionString" variable. 

Finally, take the **YourDeviceID** portion of your connection string and paste it into the "DeviceID" variable. Save your code file.

## Verify and Upload Your Code

Now it is time to bring your ESP32 to life! In the top left corner of the Arduino IDE, click the "Verify" button, which looks like a checkbox (shown below)

![Verify Code](/img/screenshots/verify-code.png)

This will compile your code and ensure that your code has no errors like missing libraries or incorrect syntax.

Once this is complete, click on the "Upload" button, which looks like a horizontal arrow, and is right next to the "Verify" button (shown below)

![Upload Code](/img/screenshots/upload-code.png)

This will take your code and flash it to the ESP32 board. You will see some red text outputted to the terminal on the bottom of the screen. The toolbar will say "Done Uploading" once complete and should look something like this:

![Done Uploading](/img/screenshots/done-uploading.png)

Your ESP32 should now be taking sensor readings and sending the information up to IoT Ensemble! If you want to see a live view of your code running, click **Tools** -> **Serial Monitor** in the top toolbar. You should be able to see your sensor readings every 30 seconds. In the Serial Monitor window, make sure that you have the baud rate set to "115200", as shown below:

![Serial Monitor](/img/screenshots/serial-monitor-115200.png)

Once you confirm that messages are sending correctly, you can now go to [IoT Ensemble](https://www.iot-ensemble.com/dashboard/) and see your messages in real time. Messages will appear under the "Device Telemetry" section, as shown below:

![Iot Ensemble ESP32 Telemetry](/img/screenshots/live-esp32-data.png)

Just make sure that you have the Device Telemetry toggle set to "Enabled". For more information on Device Telemetry, check out our [docs](../getting-started/viewing-device-data).

## Next Steps
Hooking up the hardware is just the beginning of IoT Ensemble. There are a number of options for accessing and displaying your data easily. 
- [Connecting Downstream Devices](../getting-started/connecting-downstream) will walk through the different ways to access your data.
- Check out the documentation for connecting your data with outside tools, such as [Power BI](../devs/storage/power-bi), [Grafana](../devs/storage/grafana), and others. 
