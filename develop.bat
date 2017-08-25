start cmd.exe @cmd /k "mongod --auth" &
start cmd.exe @cmd /k "sass --watch public/scss:public/css" &
start cmd.exe @cmd /k "node git-add.js" &
start cmd.exe @cmd /k "npm start" &
start "" "%PROGRAMFILES%\Git\bin\sh.exe" --login -i -c "ssh -i node.pem ubuntu@ec2-18-220-23-4.us-east-2.compute.amazonaws.com" "%~1"