---
title: PLCnext Tableau Dashboard
hide_title: true
sidebar_label: PLCnext Tableau Dashboard
keywords:
    - phoenix contact
    - plcnext
    - fathym
    - iot ensemble
    - plc controllers
    - microsoft azure
    - tableau
    - devices
    - sensors
    - dashboards
    - reports
hide_table_of_contents: true
---

## PLCnext Tableau Dashboard

Once you have your Phoenix Contact PLCnext Control data flowing to the cloud, it's time to create some Tableau Dashboards so that you can easily monitor everything. But first things first, let's get our PLCnext Control connected to Microsoft Azure.

![Phoenix Contact PLCnext](https://www.iot-ensemble.com/img/screenshots/PLCnext_controllers.png)

Phoenix Contact has a video at https://youtu.be/QST1RpTkdfA that shows how to connect your PLCnext controller to an Azure IoT Hub using a Node.js client. It's a great video and very informative. However, instead of going through all of the tedious steps outlined in the video of setting up an Azure resource group, the IoT Hub, storage containers, the storage endpoints, and everything else, I prefer to use Fathym's [IoT Ensemble](https://www.iot-ensemble.com/). With one click I can register my PLCnext device and immediately get access to the data for downstream use in alerts, dashboards, visualizations, and machine learning. After I enroll my device in IoT Ensemble, it displays the IoT Hub connectionstring. I take the connectionstring into PLCnext Engineer to use as my Azure Key and I'm ready to rock. Here's a screenshot of my connected PLCnext Control.

![IoT Ensemble List Device](https://www.iot-ensemble.com/img/screenshots/plcnext-connstring.png)

The PLCnext data is immediately flowing to IoT Ensemble and I can view the data on screen. Reminder that behind the scenes in IoT Ensemble the PLCnext data is stored in Microsoft Azure in blob storage, as well as in CosmosDB. 

:::tip How to access data in Microsoft Azure
Behind the scenes in IoT Ensemble the PLCnext data is stored in Microsoft Azure in blob storage, as well as in CosmosDB. [Read This](https://www.iot-ensemble.com/docs/getting-started/connecting-downstream) to learn more about accessing your data.
:::

Fathym's IoT Ensemble is providing an easy-to-use UI for interacting with the data instead of using the Azure portal - and it saves me a ton of time and money.

![Fathym IoT Ensemble](https://www.iot-ensemble.com/img/screenshots/iot-ensemble-connected-devices.png)

## PLCnext Tableau Dashboard

Now that my PLCnext data is flowing to IoT Ensemble, it's time to create some Tableau Dashboards to monitor everything. This [IoT Ensemble doc](https://www.iot-ensemble.com/docs/devs/storage/tableau) explains how to import data from IoT Ensemble into Tableau and setup a dashboard. Here's a screenshot.

![Tableau Dashboard](https://www.iot-ensemble.com/img/screenshots/tableau-dashboard-plcnext.png)

[Sign up](https://www.iot-ensemble.com/dashboard) for IoT Ensemble and save your company thousands of dollars in Azure setup and management costs. Enroll your first PLCnext Control with IoT Ensemble for free. No credit card required. No Azure account required. It really is that simple.

:::info
[Enroll your first PLCnext Control](https://www.iot-ensemble.com/dashboard) with IoT Ensemble for free.  
No credit card required.  
No Azure account required.
:::