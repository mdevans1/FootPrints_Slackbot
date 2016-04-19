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
    1: 'Hardware',
    2: 'Software',
    3: 'Mobile Devices',
    4: 'Email',
    5: 'Virtual Lab',
    6: 'Physical Labs',
    7: 'Audio Visual',
    8: 'Server',
    9: 'Networking',
    10: 'Building Infrastructure',
    11: 'Other',
    12: 'Web',
    13: 'Spam'
};

var issueString = ''

//Set SMTP server and footprints email address
var serverAddress = "mail.company.com"
var emailAddress = "footprints@email.com"

//Set Slack Token
var slackToken = "123456789"

//Set local json file store
var fileStore = './footprints'
```