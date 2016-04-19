# Simple Slack-bot that collects information to email to BMC Footprints 

Relies on [BotKit](https://github.com/howdyai/botkit)

```npm install --save botkit```

Relies on [NodeMailer](https://github.com/nodemailer/nodemailer)

install with NPM

```
npm install nodemailer

npm install nodemailer-smtp-transport
```

##Configure the script

```
//Set Selectable Issue Types
var issues = {
   'Hardware',
   'Software',
   'Mobile Devices',
   'Email',
   'Virtual Lab',
   'Physical Labs',
   'Audio Visual',
   'Server',
   'Networking',
   'Building Infrastructure',
   'Other',
   'Web',
   'Spam'
};


//Set SMTP server and footprints email address
var serverAddress = "mail.company.com"
var emailAddress = "footprints@email.com"

//Set Slack Token
var slackToken = "123456789"

//Set local json file store
var fileStore = './footprints'
```
