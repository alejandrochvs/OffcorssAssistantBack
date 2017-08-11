start cmd.exe @cmd /k "mongod" &
start cmd.exe @cmd /k "sass --watch public/scss:public/css" &
start cmd.exe @cmd /k "npm start" &
start cmd.exe @cmd /k "node git-pull.js"