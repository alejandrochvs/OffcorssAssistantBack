start cmd.exe @cmd /k "mongod --auth --dbpath=D:\Nodejs\OffcorssAssistantBack\Data" &
start cmd.exe @cmd /k "sass --watch public/scss:public/css" &
start cmd.exe @cmd /k "node git-add.js" &
start cmd.exe @cmd /k "npm start" &
start "" "%PROGRAMFILES%\Git\bin\sh.exe" --login -i -c "ssh -i node.pem ubuntu@13.59.244.24" "%~1"