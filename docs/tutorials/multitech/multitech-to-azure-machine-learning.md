---
title: MultiTech Machine Learning
hide_title: true
sidebar_label: MultiTech Machine Learning
keywords:
    - multitech
    - multitech conduit
    - fathym
    - iot ensemble
    - iot
    - microsoft azure
    - machine learning
    - models
    - devices
    - sensors
    - dashboards
    - reports
hide_table_of_contents: true
---

## MultiTech to IoT Ensemble to Machine Learning

Once you have your MultiTech Conduit data flowing to the cloud, it's time to create some Power BI reports so that you can easily monitor everything. But first things first, let's get our MultiTech Conduit connected to Microsoft Azure.

![MultiTech Conduit Diagram](https://www.iot-ensemble.com/img/screenshots/MT_Conduit_Schematic_Diagram.png)

MultiTech Conduit has a great article located [here](https://github.com/Azure/azure-iot-device-ecosystem/blob/master/get_started/mlinux-multiconnect-conduit-c.md)  that shows how to connect your MultiTech Conduit device to an Azure IoT Hub running mLinux with Azure IoT SDK.  It's a great source and very informative. However, instead of going through all of the tedious steps outlined in the tutorial of setting up an Azure resource group, the IoT Hub, storage containers, the storage endpoints, and everything else, I prefer to use Fathym's **[IoT Ensemble](https://www.iot-ensemble.com)**. With one click I can register my MultiTech Conduit device and immediately get access to the data for downstream use in alerts, dashboards, visualizations, and machine learning. After I enroll my device in IoT Ensemble, it displays the IoT Hub connectionstring. I take the connectionstring into the simple C Sample provided to use as my Azure Key and I'm ready to rock. Here's a screenshot of my device connected the MultiTech Conduit as well as a screen shot indicating the placeholder for your connectionstring in the C Sample.

![IoT Ensemble List Device](https://www.iot-ensemble.com/img/screenshots/MultiTech-Connected-Devices.png)

![MultiTech Connection String Reference](https://www.iot-ensemble.com/img/screenshots/MultiTech-Connectionstring-Reference.png)

The MultiTech data is immediately flowing to IoT Ensemble and I can view the data on screen. Reminder that behind the scenes in IoT Ensemble the MultiTech data is stored in Microsoft Azure in blob storage, as well as in CosmosDB.  

:::tip How to access data in Microsoft Azure
Behind the scenes in IoT Ensemble the MultiTech data is stored in Microsoft Azure in blob storage, as well as in CosmosDB. [Read this](https://www.iot-ensemble.com/docs/getting-started/connecting-downstream) to learn more about accessing your data
:::

Fathym's IoT Ensemble is providing an easy-to-use UI for interacting with the data instead of using the Azure portal - and it saves me a ton of time and money.

![Fathym IoT Ensemble](https://www.iot-ensemble.com/img/screenshots/MultiTech-Dashboard.png)

## MultiTech Power BI Reports

Now that my MultiTech data is flowing to IoT Ensemble, it's time to create some Power BI reports to monitor everything. This [IoT Ensemble doc](https://www.iot-ensemble.com/docs/devs/storage/power-bi) explains how to import data from IoT Ensemble into Power BI and setup reports and visualizations. Here's a screenshot.

![Power BI Reports](https://powerbicdn.azureedge.net/mediahandler/blog/legacymedia/5078.dashboard5.png)

[Sign up](https://www.iot-ensemble.com/dashboard) for IoT Ensemble and save your company thousands of dollars in Azure setup and management costs. Enroll your first MultiTech Conduit with IoT Ensemble for free. No credit card required. No Azure account required. It really is that simple.

:::info
[Enroll your first MultiTech Conduit](https://www.iot-ensemble.com/dashboard) with IoT Ensemble for free.  
No credit card required.  
No Azure account required.
:::