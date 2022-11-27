# Quality Control Platform 📱🎓

The platform for the analysis and results of quality control is my original engineering project. Its functions allow you to manage the product quality control process performed by a quality controller. It is a platform that can be displayed as a mobile application and website. Preferred use: an employee using a mobile application, and a manager using a website.

## Technology stack
The application was programmed using the **Ionic Framework** and **Angular**. The server part is performed by a web-api application written in **.NET Core (Entity Framework Core)**. The data is stored in an **SQL database**. The application is connected to the **Firebase** server responsible for storing encrypted login data and media, e.g. photos, digital signatures.

## Features

- Logging in via the Firebase server
- Module for assigning a role on the platform (employee or manager)
- Create a digital report on the quality control process
- Take a photo and upload it to the Firebase server
- Make a digital signature
- Export the report as a PDF file
- Accept, reject or correct the report (as manager)
- View report statistics in the form of graphs *
###### * - requires development and correction

## Development

I have a lot of ideas for developing this application. First of all, I would like to expand and improve the charting module. Then I would like to completely introduce cloud services like Azure. In addition, you can develop the statistics module very well and combine it with the generation of digital reports.
