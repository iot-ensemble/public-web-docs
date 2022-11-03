---
title: Setting up Emotibit Hardware to Stream Data to Fathym's IoT Ensemble
hide_title: true
sidebar_label: Emotibit Device Setup Tutorial
keywords:
    - iot
    - emotibit
    - azure
    - connect a device
    - iot hub
    - support
    - ESP32
    - Arduino
    - tutorial
hide_table_of_contents: true
---

## Connecting Emotibit's ESP32-based Board and Streaming Live Sensor Data with IoT Ensemble

In this tutorial, we will be taking an [Emotibit](https://www.emotibit.com) (An ESP32-based health monitoring board), reading it's multiple sensor datastreams, and send real-time messages to IoT Ensemble.

### Things you will need
- [Emotibit bundle](https://shop.openbci.com/products/all-in-one-emotibit-bundle)
- Your computer/laptop
- [Arduino IDE](https://www.arduino.cc/en/software) installed on your computer
- A [Fathym IoT Ensemble](https://www.fathym.com/iot/dashboard) account (we’re using the free, shared version)

## Part 1 - Hook Up Your Hardware 
First, we need to attach the male headers of the ESP32 board to the Emotibit sensor board. For more info on how to do this, look at the "Stack Your Emotibit" section of this [tutorial](https://github.com/EmotiBit/EmotiBit_Docs/blob/master/Getting_Started.md#stack-your-emotibit). **Note**: Only follow the "Stack your Emotibit" section, we will be using a different approach to install/update our firmware.<br></br>

<!-- ![Hardware Hookup](https://www.fathym.com/iot/img/screenshots/hardware-hookup.jpg) -->

## Part 2 - Installing Arduino IDE and Necessary Software
Next, we will need to install all of the required software/libraries on your computer

### Installing Arduino IDE
Download your version of Arudino IDE [here](https://www.arduino.cc/en/software). Follow all of the steps in the wizard to complete installation (You can keep all of the default options the same)


### Add Sensor Libraries
Once that is complete, we need to install some libraries. Click the following links to download each zip folder <br></br>

[Download the ESP32 Azure IoT Arduino Library (ZIP)](https://github.com/ttrichar/ESP32_AzureIoT_Arduino/archive/refs/heads/master.zip)  

[Download the Adafruit IS31FL3731 Library (ZIP)](https://github.com/adafruit/Adafruit_IS31FL3731/archive/refs/heads/master.zip)  


Once you have downloaded those, go to your Arduino IDE screen. In the top toolbar, select **Sketch** -> **Include Library** -> **Add .ZIP Library**, as shown below:

![Add .Zip Library](https://www.fathym.com/iot/img/screenshots/add-zip-library.png)
<br></br>

This will open a file browser. Navigate to your downloaded package, select the zip folder, and click "Open". Repeat this step for the second package.

### Add Additional Library
In the top toolbar navigate to **Tools** -> **Manage Libraries**. On the next screen, type "NTPClient" into the search bar. A library with the same name should show up in the list. Click "Install", and then "Close"

### Add ESP32 Board Definition

In order for us to work with the ESP32, we need to add a board "definition". 

1. Copy the following link:
    > https://dl.espressif.com/dl/package_esp32_index.json

2. Back in your Arduino IDE, in the top toolbar, click **File** -> **Preferences**. You will be taken to the follow screen:

![Add Board Definition](https://www.fathym.com/iot/img/screenshots/add-board-definition.png)

Take the link from the previous step, and paste it into the "Additional Boards Manager URLs" field (highlighted above in red). Click "OK"

3. Next, in the top toolbar, click **Tools** -> **Board: "Name of Board"** -> **Boards Manager...**, as shown below:

![Open Boards Manager](https://www.fathym.com/iot/img/screenshots/boards-manager.png)

In the next screen, type "esp32" into the search bar. A board definition with the same name will appear, click "Install", then click "Close" (as shown below)

![ESP32 Board Definition](https://www.fathym.com/iot/img/screenshots/esp32-board-definition.png)

4. Next, navigate to **Tools** -> **Board: "Name of Board"** -> **ESP32 Arduino** and select **Adafruit ESP32 Feather**, as shown below:

![Select Board Definition](https://www.fathym.com/iot/img/screenshots/select-board-definition.png)


## Determine Communication Port Number

Now that we have all the necessary libraries and dependencies, we need to tell Arduino IDE which port to use to communicate with your ESP32. 

1. **Before plugging in the ESP32 to your computer**, click **Tools** -> **Port** in the top toolbar of Arduino IDE. This will display a list of ports that are currently being used. Generally, there will only be one or two ports listed, depending on what you have plugged into your computer. Take note of the ports in this list. The picture below shows a list of ports **before** the ESP32 board is plugged in. 

![Ports Before Plugging In](https://www.fathym.com/iot/img/screenshots/com-port-before.png)

2. Next, plug your ESP32 board directly into one of your computer's USB ports. After this, follow the previous step to view the list of available ports. You should now see an additional port that wasn't in the list before. This is the port that your ESP32 board is using. Click the port to select it. In the picture below, "COM3" is the port that is new in the list.

![Ports After Plugging In](https://www.fathym.com/iot/img/screenshots/found-com-port.png)

## Get Code Onto your ESP32 board

Now that your Arduino can talk to your ESP32, it's time to put some code on your board! 

First, copy the following code:
```C
#include "Esp32MQTTClient.h"
#include "EmotiBit.h"
#include "time.h"

#define SerialUSB SERIAL_PORT_USBVIRTUAL // Required to work in Visual Micro / Visual Studio IDE
#define MESSAGE_MAX_LEN 1024
const uint32_t SERIAL_BAUD = 2000000; //115200

EmotiBit emotibit;
const size_t dataSize = EmotiBit::MAX_DATA_BUFFER_SIZE;
float data[dataSize];
static bool hasIoTHub = false;
unsigned long epochTime;
const char* ntpServer = "pool.ntp.org";
String fathymConnectionStringPtr;
String fathymDeviceID;
char fathymReadings[25][3] = {{}};
int readingsInterval;
char metadataTypeTags[3];

void onShortButtonPress()
{
  // toggle wifi on/off
  if (emotibit.getPowerMode() == EmotiBit::PowerMode::NORMAL_POWER)
  {
    emotibit.setPowerMode(EmotiBit::PowerMode::WIRELESS_OFF);
    Serial.println("PowerMode::WIRELESS_OFF");
  }
  else
  {
    emotibit.setPowerMode(EmotiBit::PowerMode::NORMAL_POWER);
    Serial.println("PowerMode::NORMAL_POWER");
  }
}

void onLongButtonPress()
{
  emotibit.sleep();
}

EmotiBit::DataType loadDataTypeFromTypeTag(String typeTag) {
  if (typeTag == "AX"){
    EmotiBit::DataType dataType {EmotiBit::DataType::ACCELEROMETER_X};
    return dataType;
  } 
  else if (typeTag == "AY"){
    EmotiBit::DataType dataType {EmotiBit::DataType::ACCELEROMETER_Y};
    return dataType;
  }
  else if (typeTag == "AZ"){
    EmotiBit::DataType dataType {EmotiBit::DataType::ACCELEROMETER_Z};
    return dataType;
  }
  else if (typeTag == "GX"){
    EmotiBit::DataType dataType {EmotiBit::DataType::GYROSCOPE_X};
    return dataType;
  }
  else if (typeTag == "GY"){
    EmotiBit::DataType dataType {EmotiBit::DataType::GYROSCOPE_Y};
    return dataType;
  }
  else if (typeTag == "GZ"){
    EmotiBit::DataType dataType {EmotiBit::DataType::GYROSCOPE_Z};
    return dataType;
  }
  else if (typeTag == "MX"){
    EmotiBit::DataType dataType {EmotiBit::DataType::MAGNETOMETER_X};
    return dataType;
  }
  else if (typeTag == "MY"){
    EmotiBit::DataType dataType {EmotiBit::DataType::MAGNETOMETER_Y};
    return dataType;
  }
  else if (typeTag == "MZ"){
    EmotiBit::DataType dataType {EmotiBit::DataType::MAGNETOMETER_Z};
    return dataType;
  }
  else if (typeTag == "EA"){
    EmotiBit::DataType dataType {EmotiBit::DataType::EDA};
    return dataType;
  }
  else if (typeTag == "EL"){
    EmotiBit::DataType dataType {EmotiBit::DataType::EDL};
    return dataType;
  }
  else if (typeTag == "ER"){
    EmotiBit::DataType dataType {EmotiBit::DataType::EDR};
    return dataType;
  }
  else if (typeTag == "H0"){
    EmotiBit::DataType dataType {EmotiBit::DataType::HUMIDITY_0};
    return dataType;
  }
  else if (typeTag == "T0"){
    EmotiBit::DataType dataType {EmotiBit::DataType::TEMPERATURE_0};
    return dataType;
  }
  else if (typeTag == "TH"){
    EmotiBit::DataType dataType {EmotiBit::DataType::THERMOPILE};
    return dataType;
  }
  else if (typeTag == "PI"){
    EmotiBit::DataType dataType {EmotiBit::DataType::PPG_INFRARED};
    return dataType;
  }
  else if (typeTag == "PR"){
    EmotiBit::DataType dataType {EmotiBit::DataType::PPG_RED};
    return dataType;
  }
  else if (typeTag == "PG"){
    EmotiBit::DataType dataType {EmotiBit::DataType::PPG_GREEN};
    return dataType;
  }
  else if (typeTag == "BV"){
    EmotiBit::DataType dataType {EmotiBit::DataType::BATTERY_VOLTAGE};
    return dataType;
  }
  else if (typeTag == "BP"){
    EmotiBit::DataType dataType {EmotiBit::DataType::BATTERY_PERCENT};
    return dataType;
  }
  else if (typeTag == "DO"){
    EmotiBit::DataType dataType {EmotiBit::DataType::DATA_OVERFLOW};
    return dataType;
  }
  else if (typeTag == "DC"){
    EmotiBit::DataType dataType {EmotiBit::DataType::DATA_CLIPPING};
    return dataType;
  }
  else if (typeTag == "DB"){
    EmotiBit::DataType dataType {EmotiBit::DataType::DEBUG};
    return dataType;
  }
  else{
    EmotiBit::DataType dataType {EmotiBit::DataType::DEBUG};
    return dataType;
  }  
}

void setup()
{
  Serial.begin(SERIAL_BAUD);
  Serial.println("Serial started");
  delay(2000);  // short delay to allow user to connect to serial, if desired

  emotibit.setup();

  if (!loadConfigFile(emotibit._configFilename)) {
    Serial.println("SD card configuration file parsing failed.");
    Serial.println("Create a file 'config.txt' with the following JSON:");
    Serial.println("{\"WifiCredentials\": [{\"ssid\": \"SSSS\", \"password\" : \"PPPP\"}],\"Fathym\":{\"ConnectionString\": \"xxx\", \"DeviceID\": \"yyy\"}}");
  }
  
  const char* connStr = fathymConnectionStringPtr.c_str();
  
  if (!Esp32MQTTClient_Init((const uint8_t*)connStr, true))
  {
    hasIoTHub = false;
    Serial.println("Initializing IoT hub failed.");
    return;
  }

  hasIoTHub = true;

  // Attach callback functions
  emotibit.attachShortButtonPress(&onShortButtonPress);
  emotibit.attachLongButtonPress(&onLongButtonPress);

  configTime(0, 0, ntpServer);
}

void loop()
{
  emotibit.update();

  epochTime = getTime();
  
  // allocate the memory for the document
  const size_t CAPACITY = JSON_OBJECT_SIZE(1);
  
  StaticJsonBuffer<1000> doc;
  
  JsonObject& payload = doc.createObject();

  payload[String("DeviceID")] = fathymDeviceID;

  payload["DeviceType"] = "emotibit";

  payload["Version"] = "1";

  JsonObject& payloadDeviceData = payload.createNestedObject("DeviceData");

  payloadDeviceData["Timestamp"] = String(epochTime);

  JsonObject& payloadSensorReadings = payload.createNestedObject("SensorReadings");

  JsonObject& payloadSensorMetadata = payload.createNestedObject("SensorMetadata");

  JsonObject& payloadSensorMetadataRoot = payloadSensorMetadata.createNestedObject("_");

  for (String typeTag : fathymReadings) {     
    enum EmotiBit::DataType dataType = loadDataTypeFromTypeTag(typeTag);
    size_t dataAvailable = emotibit.readData((EmotiBit::DataType)dataType, &data[0], dataSize);
        
    if (dataAvailable > 0)
    {
      payloadSensorReadings[typeTag] = String(data[dataAvailable - 1]);
    }
  }
  
  char messagePayload[MESSAGE_MAX_LEN];

  // serialize the payload for sending
  payload.printTo(messagePayload);

  Serial.println(messagePayload);

  EVENT_INSTANCE* message = Esp32MQTTClient_Event_Generate(messagePayload, MESSAGE);

  Esp32MQTTClient_SendEventInstance(message);

  delay(readingsInterval);
}

// Loads the configuration from a file
bool loadConfigFile(const char *filename) {
  // Open file for reading
  File file = SD.open(filename);

  if (!file) {
    Serial.print("File ");
    Serial.print(filename);
    Serial.println(" not found");
    return false;
  }

  Serial.print("Parsing: ");
  Serial.println(filename);

  // Allocate the memory pool on the stack.
  // Don't forget to change the capacity to match your JSON document.
  // Use arduinojson.org/assistant to compute the capacity.
  StaticJsonBuffer<1024> jsonBuffer;

  // Parse the root object
  JsonObject& root = jsonBuffer.parseObject(file);

  JsonArray& readingValues = root["Fathym"]["Readings"].as<JsonArray>();

  const char* readings[11];
  
  readingValues.copyTo(readings);

  for(int i = 0; i < (sizeof readings / sizeof readings[0]); i++){
    strcpy(fathymReadings[i], readings[i]);
  }

  if (!root.success()) {
    Serial.println(F("Failed to parse config file"));
    return false;
  }

  fathymConnectionStringPtr = root["Fathym"]["ConnectionString"].as<String>();
  
  fathymDeviceID = root["Fathym"]["DeviceID"].as<String>();

  readingsInterval = root["Fathym"]["ReadingInterval"] | 5000;

  // Close the file (File's destructor doesn't close the file)
  // ToDo: Handle multiple credentials

  file.close();
  return true;
}

// Function that gets current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}
```
<br></br>

Next, in the ArduinoIDE, delete the existing template code. Then, paste the code you just copied.

Before we can continue, we need to register your Emotibit device with Iot Ensemble

## Part 5 - Configuring IoT Ensemble

Before we can tell your device where to send data, we first need somewhere to send the data.  There are a number of different ways this can be accomplished, with IoT Ensemble the focus is helping you leverage best practice cloud IoT technology.  Here we'll be using the Azure IoT Hub to connect devices to a shared data flow, and then make it avaiable downstream for use in other applications.

Follow these steps to create a new device in IoT Ensemble. For more details on the full IoT Ensemble experience, check out our [full documentation](/getting-started/connecting-first-device).

Start by navigating to the [IoT Ensemble Dashboard](https://www.fathym.com/dashboard/iot/) and sign in or sign up.  For the purposes of moving forward, you will only need the Free license and no credit card will be required.

### Enroll a Device

In the **Connected Devices** section, click the **Enroll New Device** button, provide a name for your device (i.e. my-first-device) and click **Enroll Device**.  That’s it!  Your device is now registered and should be visible in the dashboard, along with its associated connection string.

![Dashboard device list first device](https://www.fathym.com/iot/img/screenshots/dashboard-device-list-first-device.png)

Click on the <img src="https://www.fathym.com/iot/img/screenshots/icon-copy.png" class="text-image" /> button to copy your connection string to your clipboard. Your connection string should look something like this:

> HostName=**YourHostName**;DeviceId=**YourDeviceID**;SharedAccessKey=**YourDeviceKey**

In addition to the whole connection string, there is one key part that we need: the **YourDeviceID** portion. This value needs to be a part of the data payload. Let's add them now.


## Configure the Code

Back in the Arduino IDE, near the top of the code, your should see a section of four values that need to be filled in, like this:

![Values to Fill In](https://www.fathym.com/iot/img/screenshots/arduino-fill-in-values.png)

First, fill in the WiFi name and password of the network you plan on using.

> ### **Please Note!**
> With this particular ESP32 board, it can only connect to 2.4 Ghz Wifi networks. The board **CAN NOT** connect to 5 Ghz networks. If you attempt to connect to a 5 Ghz network, this code will not work.

Next, take your connection string from Iot Ensemble, and paste it into the "connectionString" variable. 

Finally, take the **YourDeviceID** portion of your connection string, and paste it into the "DeviceID" variable. Save your code file.

## Verify and Upload Your Code

Now it is time to bring your ESP32 to life! In the top left corner of the Arduino IDE, click the "Verify" button, which looks like a checkbox (shown below)

![Verify Code](https://www.fathym.com/iot/img/screenshots/verify-code.png)

This will compile your code, and ensure that your code has no errors like missing libraries or incorrect syntax.

Once this is complete, click on the "Upload" button, which looks like a horizontal arrow, and is right next to the "Verify" button (shown below)

![Upload Code](https://www.fathym.com/iot/img/screenshots/upload-code.png)

This will take your code, and flash it to the ESP32 board. You will see some red text outputted to the terminal on the bottom of the screen. The toolbar will say "Done Uploading" once complete, and should look something like this:

![Done Uploading](https://www.fathym.com/iot/img/screenshots/done-uploading.png)

Your ESP32 should now be taking sensor readings, and sending the information up to Iot Ensemble! If you want to see a live view of your code running, click **Tools** -> **Serial Monitor** in the top toolbar. You should be able to see your sensor readings every 30 seconds. In the Serial Monitor window, make sure that you have the baud rate set to "9600", as shown below:

![Serial Monitor](https://www.fathym.com/iot/img/screenshots/serial-monitor.png)

Once you confirm that messages are sending correctly, you can now go to [IoT Ensemble](https://www.fathym.com/dashboard/iot/) and see your messages in real time. Messages will appear under the "Device Telemetry" section, as shown below:

![Iot Ensemble ESP32 Telemetry](https://www.fathym.com/iot/img/screenshots/live-esp32-data.png)

Just make sure that you have the Device Telemetry toggle set to "Enabled". For more information on Device Telemetry, check out our [docs](/getting-started/viewing-device-data).

## Next Steps
Hooking up the hardware is just the beginning of Iot Ensemble. There are a number of options for accessing and displaying your data easily. 
- [Connecting Downstream Devices](/getting-started/connecting-downstream) will walk through the different ways to access your data.
- Check out the documentation for connecting your data with outside tools, such as [Power BI](/devs/storage/power-bi), [Grafana](/devs/storage/grafana), and others. 