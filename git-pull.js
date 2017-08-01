var exec = require('child_process').exec;
var cmd = 'sudo git pull origin master';
setInterval(function () {
    exec(cmd, function (err, stdout, stderr) {
        return console.log(stdout);
    });
}, 10000);
