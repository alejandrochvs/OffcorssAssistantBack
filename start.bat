start cmd.exe @cmd /k "mongod --auth" &
start cmd.exe @cmd /k "sass --watch public/scss:public/css" &
start cmd.exe @cmd /k "node git-pull.js" &
start cmd.exe @cmd /k "npm start"