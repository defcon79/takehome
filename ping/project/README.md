** Pingy Demo App by Maneesh **

Installation

1. Install Node (recent version > v9) on local machine
2. Login to https://pingdemotime.slack.com, username:pingdemo@mail.com password:Ping_demo1. The Pingy demo app is already installed in this workspace.
3. On local machine, get the code from https://bitbucket.org/pingdemo1/pingy/
4. Do 'npm install'
5. I am using ngrok for local server, I have added the Linux version binary under 'bin/ngrok'. copy it to /user/local/bin if using Linux. I am also using this under Windows 10 using the WSL (Ubuntu in Windows)
6. Open 2 terminal windows - in the 1st one run 'ngrok http 3000' - this opens a tunneled port. The command will show a generated public url similar to - 'Forwarding                    http://0a8b71a9.ngrok.io -> localhost:3000'
7. This url needs to be configured in slack since it changes every time (this is because we are testing with local machine. A real app would be deployed to the cloud so we wont need to tunnel)
8. In Slack go to the Slash commands page - I see https://api.slack.com/apps/ABYNCF9HD or maybe https://my.slack.com/services/new/slash-commands. There are 7 commands. All of them have a similar requestUrl - http://0a8b71a9.ngrok.io/cmd/show. this needs to be changed to the one you have from step 6
9. In the 2nd terminal window, run the node server - 'node server'
10. In Slack commands can be tested from any channel/user


## App Usage

The Pingy Demo app implements a very basic timekeeping service !! 
All commands have detailed usage messages and error handling and param validation as well.

It has the following commands -

(you can use shortcuts 'l' and 'c' for lawyer and case too. I added this because it makes testing much faster)

/hi - just a simple test which gives you back the channe;/user id

/add - allows you to add lawyer or case and optionally hourly rate
e.g. 
/add lawyer Jim 
/add lawyer Paul 200 // rate=200/hr
/add lawyer Ryan 500 // rate=500/hr
/add case Corp1
/add case Fraud

/show - shows you info on current cases/lawyers 

For each case any laywer assigned to it is also shown

/bill [lawyer] [case] [hours]

assigns lawyers to cases and adds billable hours

e.g
/bill Jim Corp1 10
/bill Paul Corp1 20
/bill Jim Corp1 5
/bill Jim Fraud 5
/bill Ryan Fraud 20
/bill Paul Corp1 2

/getbill
Gets a tabulated summary of total bill

/getbillforlawyer 
Gets a tabulated summary of total bill by lawyer

/getbillforcase
Gets a tabulated summary of total bill by case name

## App Notes

The app is written in ES6 and Nodejs. It is very modular and can be easily extended for other things. It uses Express for the webserver and ES6 maps for the data store (which would be a real DB in actual app). Usng ES6 also makes the code more readable and shorter.

The function 'sendSlack' is used to return results to slack and can handle both ephemeral and private responses.

Please also see comments in code.