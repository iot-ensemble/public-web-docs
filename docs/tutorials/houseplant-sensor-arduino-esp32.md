---
title: Build your own Smart Houseplant Monitor
hide_title: true
sidebar_label: ESP32 / Houseplant Monitoring
keywords:
    - iot
    - azure
    - connect a device
    - iot hub
    - support
    - house plant
    - smart garden
    - tutorial
hide_table_of_contents: true
---

## Build Your Own Smart Houseplant Monitor with IoT Ensemble

![Hardware Hookup](/img/houseplant_monitor.jpg)

For many people nowadays (myself included), houseplants are all the rage. They bring color and happiness to any space, and can really tie a room together with a lively aesthetic. That is, if they're kept alive and healthy, which is sometimes easier said than done. Thankfully, we can easily create our own solution to monitor your precious plant babies with just a few components.

In this tutorial, we will be taking a generic ESP32 board, along with a soil moisture sensor and UV sensor, and create a real-time view of your houseplant's environment. The LCD screen shows the current UV Index and soil moisture content of the soil, while the ESP32 board sends this data up to IoT Ensemble every 30 seconds. Let's get started! 

### Things you will need
- [SparkFun Thing Plus - ESP32 WROOM Board](https://www.sparkfun.com/products/15663)
- At least 4 [Qwiic Cables](https://www.sparkfun.com/products/14426) (Any length is fine for this tutorial)
- Your computer/laptop
- A Micro-USB cable to connect the ESP32 to your computer
- [SparkFun Qwiic Mux Breakout - TCA9548A](https://www.sparkfun.com/products/16784)
- [SparkFun Qwiic Soil Moisture Sensor](https://www.sparkfun.com/products/17731)
- [SparkFun UV Light Sensor Breakout - VEML6075](https://www.sparkfun.com/products/15089)
- [SparkFun 16x2 SerLCD - RGB Backlight Qwiic](https://www.sparkfun.com/products/16396)
- [Arduino IDE](https://www.arduino.cc/en/software) installed on your computer
- A [Fathym IoT Ensemble](https://www.iot-ensemble.com/dashboard) account (we’re using the free, shared version)

## Part 1 - Hook Up Your Hardware 
First, we need to attach all the necessary sensors and components to each other. The picture below shows the way that I have set up my plant monitor.<br></br>

![Hardware Hookup](/img/houseplant_hardware_hookup.png)

Thanks to the Qwiic system and the Mux Breakout board, there are several ways that these sensors can be configured in a very "Lego-like" fashion. The only constant is that the ESP32 board needs to be connected to one of the two "Main" ports. The rest of the sensors can be plugged into any of the remaining ports. A few things to note here:
- For my plant monitor, I used port 0 for the UV sensor and soil moisture sensor, and port 7 for the LCD screen. Again, you can use whatever ports you'd like, but if you use different ports than I used, you will need to make a small code change. For example, if you are using ports 1 instead of port 0, you will need to change the code from "enableMuxPort(0)" to "enableMuxPort(1)".
- This also enables us to add more than one instance of the UV sensor and soil moisture sensor, that way you can truly cover a garden of any size!

## Part 2 - Installing Arduino IDE and Necessary Software
Next, we will need to install all of the required software/libraries on your computer

### Installing Arduino IDE
Download your version of Arudino IDE [here](https://www.arduino.cc/en/software). Follow all of the steps in the wizard to complete installation (You can keep all of the default options the same)


### Add Sensor Libraries
Once that is complete, we need to install some libraries. Click the following links to download each zip folder <br></br>

[Download the SparkFun SerLCD Library (ZIP)](https://github.com/sparkfun/SparkFun_SerLCD_Arduino_Library/archive/refs/heads/master.zip)  

[Download the SparkFun I2C Mux Library (ZIP)](https://github.com/sparkfun/SparkFun_I2C_Mux_Arduino_Library/archive/refs/heads/master.zip)  

[Download the VEML6075 UV Sensor Library (ZIP)](https://github.com/sparkfun/SparkFun_VEML6075_Arduino_Library/archive/master.zip) 

Once you have downloaded those, go to your Arduino IDE screen. In the top toolbar, select **Sketch** -> **Include Library** -> **Add .ZIP Library**, as shown below:

![Add .Zip Library](/img/screenshots/add-zip-library.png)
<br></br>

This will open a file browser. Navigate to your downloaded package, select the zip folder, and click "Open". Repeat this step for the second package.

### Add Additional Library
In the top toolbar navigate to **Tools** -> **Manage Libraries**. On the next screen, type "NTPClient" into the search bar. A library with the same name should show up in the list. Click "Install", and then "Close"

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
 * A smart houseplant monitoring solution for Arduino ESP32 board
 */
 
#include <SerLCD.h>
#include "Esp32MQTTClient.h"
#include <SparkFun_I2C_Mux_Arduino_Library.h>
#include <WiFi.h>
#include <SparkFun_VEML6075_Arduino_Library.h>

#define MUX_ADDR 0x70 //7-bit unshifted default I2C Address
#define COMMAND_GET_VALUE 0x05
#define MESSAGE_MAX_LEN 512

const int qwiicAddress = 0x28;
int ADC_VALUE=0;

VEML6075 uv; // Create a VEML6075 object
QWIICMUX myMux;
SerLCD lcd;

// These are the four values that need to be filled out. NOTE: ESP32 boards can only connect to 2.4GHz networks, they can NOT connect to 5Ghz networks///////
const char* ssid     = "Your Wifi Name (SSID)";
const char* password = "Your Wifi Password";
static const char* connectionString = "Your Connection String";
char DeviceID[] = "Your DeviceID";
//////////////////////////////////////////////////////////////

int moistureValue = 0;
float uvIndex = 0;
char deviceVersion[] = "0.0.1";
char deviceType[] = "ESP32";
char latitude[] = "40.7578";
char longitude[] = "-104.9733";
const char *messageData = "{\"DeviceID\":\"%s\", \"DeviceType\":\"%s\", \"Version\":\"%s\", \"DeviceData\": {\"Latitude\":%s, \"Longitude\":%s}, \"SensorReadings\": {\"UVIndex\":%f, \"SoilMoistureRaw\":%u}, \"SensorMetadata\": {\"_\": {\"SignalStrength\": 1}}}";
static bool hasIoTHub = false;
static bool hasWifi = false;

void setup()
{
  Serial.begin(115200);
  Wire.begin();

  Serial.println("Initializing...");
  Serial.println(" > WiFi");
  Serial.println("Starting connecting WiFi.");

  delay(10);
  WiFi.mode(WIFI_AP);
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

  // Enable the I2C ports being used on the Sparkfun MUX Board.
  // If you are using different port numbers, make the necessary changes below:
  enableMuxPort(0);
  enableMuxPort(7);
  
  // the VEML6075's begin function can take no parameters
  // It will return true on success or false on failure to communicate
  if (uv.begin() == false)
  {
    Serial.println("Unable to communicate with VEML6075.");
    while (1);
  }
  Serial.println("UVA, UVB, UV Index");

  lcd.begin(Wire); //Set up the LCD for I2C communication
  lcd.clear(); //Clear the display - this moves the cursor to home position as well

  lcd.setBacklight(255, 255, 255); //Set backlight to bright white
  lcd.setContrast(3); //Set contrast. Lower to 0 for higher contrast. 
}

void loop()
{
  int i = 0;
  
  //take sensor readings every second to display on the LCD screen, but only send readings to IoT Ensemble every 30 seconds.
  while(i<=30){
    lcd.setCursor(0,0);
    
    moistureValue = get_soil_moisture(); //Soil moisture value. Value of 1023 is completely dry (or not in soil). Value of around 100 is submerged in water.
    
    uvIndex = uv.index(); //UV index value can be between 0-11 (0 = No UV, 11 = Highest UV).
    
    if (String(moistureValue).length() == 4)
      lcd.print("UV:" + String(uvIndex) + " Wet:" + String(moistureValue));
    else
      lcd.print("UV:" + String(uvIndex) + " Wet:" + String(moistureValue) + " ");
    
    if (uvIndex <= 0.01 && moistureValue >= 900){  
      lcd.setCursor(0,1);
      lcd.print("Need sun & water");
    }
    else if (moistureValue >= 900){
      lcd.setCursor(0,1);
      lcd.print("Dry, Need water!");
    }
    else if (uvIndex <= 0.01){
      lcd.setCursor(0,1);
      lcd.print("Need sun!       ");
    }
    else if (moistureValue <= 200){
      lcd.setCursor(0,1);
      lcd.print("Wet, leave it!  ");
    }
    else{
      lcd.setCursor(0,1);
      lcd.print("All good! :)    ");
    }
    
    i ++;
    Serial.println(String(uv.uva()) + ", " + String(uv.uvb()) + ", " + String(uv.index()));
    
    // if it's been 30-ish seconds, send current message payload up to Iot Ensemble and clear the LCD screen
    if(i == 30){
      char messagePayload[MESSAGE_MAX_LEN];
      snprintf(messagePayload, MESSAGE_MAX_LEN, messageData, DeviceID, deviceType, deviceVersion, latitude, longitude, uvIndex, moistureValue);
      EVENT_INSTANCE* message = Esp32MQTTClient_Event_Generate(messagePayload, MESSAGE);
      Esp32MQTTClient_SendEventInstance(message);
      Serial.println("Message Payload:" + String(messagePayload));
      i = 0;
      lcd.clear();
    }
    delay(1000);
  }
}

//Enables a specific port number
boolean enableMuxPort(byte portNumber)
{
  if(portNumber > 7) portNumber = 7;

  //Read the current mux settings
  Wire.requestFrom(MUX_ADDR, 1);
  if(!Wire.available()) return(false); //Error
  byte settings = Wire.read();

  //Set the wanted bit to enable the port
  settings |= (1 << portNumber);

  Wire.beginTransmission(MUX_ADDR);
  Wire.write(settings);
  Wire.endTransmission();

  return(true);
}

//Disables a specific port number
boolean disableMuxPort(byte portNumber)
{
  if(portNumber > 7) portNumber = 7;

  //Read the current mux settings
  Wire.requestFrom(MUX_ADDR, 1);
  if(!Wire.available()) return(false); //Error
  byte settings = Wire.read();

  //Clear the wanted bit to disable the port
  settings &= ~(1 << portNumber);

  Wire.beginTransmission(MUX_ADDR);
  Wire.write(settings);
  Wire.endTransmission();

  return(true);
}

// read the analog signal from the soil moisture sensor, compare high and low voltage values with bitwise operations to convert to a digital reading. 
// Readings vary from 0 to 1024. The lower the number, the higher the moisture content
int get_soil_moisture() {
  Wire.beginTransmission(qwiicAddress);
  Wire.write(COMMAND_GET_VALUE);
  Wire.endTransmission();    

  Wire.requestFrom(qwiicAddress, 2);    

  while (Wire.available()) { 
    uint8_t ADC_VALUE_L = Wire.read(); 
    uint8_t ADC_VALUE_H = Wire.read();
    ADC_VALUE=ADC_VALUE_H;
    ADC_VALUE<<=8;
    ADC_VALUE|=ADC_VALUE_L;
    Serial.print("ADC_VALUE:  ");
    Serial.println(String(ADC_VALUE)); 
  }
  
  return ADC_VALUE;
}
```
<br></br>

Next, in the ArduinoIDE, delete the existing template code. Then, paste the code you just copied.

Before we can continue, we need to register your ESP32 device with IoT Ensemble

## Part 5 - Configuring IoT Ensemble

Before we can tell your device where to send data, we first need somewhere to send the data.  There are a number of different ways this can be accomplished, with IoT Ensemble the focus is helping you leverage best practice cloud IoT technology.  Here we'll be using the Azure IoT Hub to connect devices to a shared data flow, and then make it available downstream for use in other applications.

Follow these steps to create a new device in IoT Ensemble. For more details on the full IoT Ensemble experience, check out our [full documentation](../getting-started/connecting-first-device).

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

Next, take your connection string from IoT Ensemble, and paste it into the "connectionString" variable. 

Finally, take the **YourDeviceID** portion of your connection string and paste it into the "DeviceID" variable. Save your code file.

## Verify and Upload Your Code

Now it is time to bring your ESP32 to life! In the top left corner of the Arduino IDE, click the "Verify" button, which looks like a checkbox (shown below)

![Verify Code](/img/screenshots/verify-code.png)

This will compile your code, and ensure that your code has no errors like missing libraries or incorrect syntax.

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
This solution is only one of several possibilities for your own personalized smart garden. Some fun next steps for expanding your monitor could be:
- Adding additional UV and soil moisture sensors to monitor multiple houseplants or gardening zones
- Monitoring for other useful data, like temperature, humidity, (check out one of our temperature solutions [here](../tutorials/arduino-esp32-and-enviro-sensor)) pH, air quality, and more!
- If you are comfortable with C coding in Arduino, you could also set up different configurations for different types of plants. In my code sample, you can see that I created arbitrary values for what I thought "optimal" plant conditions would be. Instead, there could be different configurations for "Succulents", which generally need more light and less water than normal plants. Another configuration could be for "Tropical" plants, which generally require more soil moisture and humidity.

Hooking up the hardware is just the beginning of IoT Ensemble. There are a number of options for accessing and displaying your data easily. 
- [Connecting Downstream Devices](../getting-started/connecting-downstream) will walk through the different ways to access your data.
- Check out the documentation for connecting your data with outside tools, such as [Power BI](../devs/storage/power-bi), [Grafana](../devs/storage/grafana), and others. 
