var Botkit = require('./lib/Botkit.js');
var mailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var issues = [
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
].map(function(obj, index) { 
    return "[" + (index + 1) + "] " + obj;
} );

var serverAddress = "mail.company.com"
var emailAddress = "footprints@email.com"
var slackToken = "123456789"
var fileStore = './footprints'

var controller = Botkit.slackbot({
    debug: false,
    json_file_store: fileStore
});

controller.spawn({
    token: slackToken,
}).startRTM(function(err) {
    if (err) {
        throw new Error(err);
    }
});

controller.hears(['createticket'], ['ambient'], function(bot, message) {
    bot.startPrivateConversation(message, askFirstName);
});

askFirstName = function(response, convo) {
    convo.ask("What is the users first and last name?", function(response, convo) {
        var name = response.text.split(" ");
        controller.storage.users.save({
            id: response.user,
            first: name[0],
            last: name[1]
        }, function(err) {
            askEmail(response, convo);
            convo.next();
        });
    });
}
askEmail = function(response, convo) {
    convo.ask("What is their email address?", function(response, convo) {
        var email = response.text.split("|");
        controller.storage.users.get(response.user, function(err, user_data) {
            user_data.email = email[1].slice(0, -1);
            controller.storage.users.save(user_data, function(err) {
                askSubject(response, convo);
                convo.next();
            });
        });
    });
}

askSubject = function(response, convo) {
    convo.ask("Please provide a short Subject or description of the problem (Example: Printer in PRN 024 is not functioning)", function(response, convo) {
        controller.storage.users.get(response.user, function(err, user_data) {
            user_data.subject = response.text;
            controller.storage.users.save(user_data, function(err) {
                askIssue(response, convo)
                convo.next();
            });
        });
    });
}

askIssue = function(response, convo) {
convo.say("Please ENTER THE NUMBER for the issue this relates to")
    convo.ask(issues.join("\n"), function(response, convo) {
	if (parseInt(response.text) < 14) {
            controller.storage.users.get(response.user, function(err, user_data) {
                user_data.issue = issues[response.text];
                controller.storage.users.save(user_data, function(err) {
                    askDescription(response, convo)
                    convo.next();
                });
            });
        } else {
            convo.repeat();
            convo.next();
        }
    });
}

askDescription = function(response, convo) {
    convo.ask("Please provide a detailed description of the problem.", function(response, convo) {
        controller.storage.users.get(response.user, function(err, user_data) {
            user_data.description = response.text;
            controller.storage.users.save(user_data, function(err) {
                submitIssue(response, convo)
                convo.next();
            });
        });
    });
}

submitIssue = function(response, convo) {
    controller.storage.users.get(response.user, function(err, user_data) {
        convo.say("Name: " + user_data.first + " " + user_data.last)
        convo.say("Email: " + user_data.email)
        convo.say("Subject: " + user_data.subject)
        convo.say("Type: " + user_data.issue)
        convo.say("Detailed Description: " + user_data.description)
    });
    
    convo.ask('Shall we submit this ticket? Say YES or NO.', function(response, convo) {
        if (response.text.match(/^(yes|yea|yup|yep|ya|sure|ok|y|yeah|yah)/i)) {
            controller.storage.users.get(response.user, email);
            convo.say('your issue has been submitted')
            convo.next();
        } else {
            convo.say('Okay, I will not submit the ticket')
            convo.next();
        }
   });
	
}
email = function(err, user_data) {
    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport(smtpTransport, {
        host: serverAddress,
    });

    var mail = {
        from: user_data.email,
        to: emailAddress,
        subject: user_data.subject,
        text: user_data.description + "\nFirst Name=" + user_data.first + "\nLast Name=" + user_data.last + "\nType=" + user_data.issue
    }

    smtpTransport.sendMail(mail, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });
}

