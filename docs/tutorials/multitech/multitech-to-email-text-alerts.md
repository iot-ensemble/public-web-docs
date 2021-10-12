---
title: MultiTech Email & Text Alerts
hide_title: true
sidebar_label: MultiTech Email & Text Alerts
keywords:
    - multitech
    - multitech conduit
    - fathym
    - iot ensemble
    - iot
    - microsoft azure
    - logic apps
    - devices
    - sensors
    - email
    - text
    - alerts
    - notifications
hide_table_of_contents: true
---

## MultiTech to IoT Ensemble to Email & Text Alerts

Once you have your MultiTech Conduit data flowing to the cloud, it's time to setup alerts and notifications so that you can easily monitor everything. I prefer using Microsoft Logic Apps for sending email and text alerts when temperatures rise above a specified threshold. But first things first, let's get our MultiTech Conduit connected to Microsoft Azure.

![MultiTech Conduit Diagram](https://www.iot-ensemble.com/img/screenshots/MT_Conduit_Schematic_Diagram.png)

MultiTech Conduit has a great article located [here](https://github.com/Azure/azure-iot-device-ecosystem/blob/master/get_started/mlinux-multiconnect-conduit-c.md)  that shows how to connect your MultiTech Conduit device to an Azure IoT Hub running mLinux with Azure IoT SDK.  It's a great source and very informative. However, instead of going through all of the tedious steps outlined in the tutorial of setting up an Azure resource group, the IoT Hub, storage containers, the storage endpoints, and everything else, I prefer to use Fathym's [IoT Ensemble](https://www.iot-ensemble.com). With one click I can register my MultiTech Conduit device and immediately get access to the data for downstream use in alerts, dashboards, visualizations, and machine learning. After I enroll my device in IoT Ensemble, it displays the IoT Hub connectionstring. I take the connectionstring into the simple C Sample provided to use as my Azure Key and I'm ready to rock. Here's a screenshot of my device connected the MultiTech Conduit as well as a screen shot indicating the placeholder for your connectionstring in the C Sample.

![IoT Ensemble List Device](https://www.iot-ensemble.com/img/screenshots/MultiTech-Connected-Devices.png)

![MultiTech Connection String Reference](https://www.iot-ensemble.com/img/screenshots/MultiTech-Connectionstring-Reference.png)

The MultiTech data is immediately flowing to IoT Ensemble and I can view the data on screen. Reminder that behind the scenes in IoT Ensemble the MultiTech data is stored in Microsoft Azure in blob storage, as well as in CosmosDB.  

:::tip How to access data in Microsoft Azure
Behind the scenes in IoT Ensemble the MultiTech data is stored in Microsoft Azure in blob storage, as well as in CosmosDB. [Read this](https://www.iot-ensemble.com/docs/getting-started/connecting-downstream) to learn more about accessing your data
:::

Fathym's IoT Ensemble is providing an easy-to-use UI for interacting with the data instead of using the Azure portal - and it saves me a ton of time and money.

![Fathym IoT Ensemble](https://www.iot-ensemble.com/img/screenshots/MultiTech-Dashboard.png)

## MultiTech Email & Text Alerts in Logic Apps

Now that my MultiTech data is flowing to IoT Ensemble, it's time to setup the email alerts using Logic Apps. This [IoT Ensemble doc](https://www.iot-ensemble.com/docs/devs/alerts/logic-apps) explains how to use Logic Apps to call the IoT Ensemble warm query every 12 hours and check if the Temperature of any of the results is greater than 45. If so, it sends an email alert. Here's a screenshot.

![Email Alert Logic Apps](https://www.iot-ensemble.com/img/screenshots/logic-apps-sendemail-settings.png)

[Sign up](https://www.iot-ensemble.com/dashboard) for IoT Ensemble and save your company thousands of dollars in Azure setup and management costs. Enroll your first MultiTech Conduit with IoT Ensemble for free. No credit card required. No Azure account required. It really is that simple.

:::info
[Enroll your first MultiTech Conduit](https://www.iot-ensemble.com/dashboard) with IoT Ensemble for free.  
No credit card required.  
No Azure account required.
:::