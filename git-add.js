var exec = require('child_process').exec;
var V = 100;
var isPaused = false;
var gitStatus = function () {
    exec('git status .', function (err, stdout, stderr) {
        var status = stdout.split('\n')[2];
        console.log('Err : ' + err);
        console.log('STDOUT : ' + status);
        console.log('STDERR : ' + stderr);
        if (status == 'Untracked files:' || status == 'Changes not staged for commit:' || isPaused == false) {
            console.log("Untracked");
            gitAdd();
        } else if (status == "Changes to be committed:" || isPaused == false) {
            gitCommit();
        } else if (status == '  (use "git push" to publish your local commits)' || isPaused == false) {
            gitPush();
        }
        return;
    });
}
var gitAdd = function () {
    isPaused = true;
    exec('git add .', function (err, stdout, stderr) {
        console.log('Err : ' + err);
        console.log('STDOUT : ' + stdout);
        console.log('STDERR : ' + stderr);
        isPaused = false;
        return;
    });
}
var gitCommit = function () {
    exec('git commit -m "Auto push V' + JSON.stringify(V).split('').join('.') + '"', function (err, stdout, stderr) {
        console.log('Err : ' + err);
        console.log('STDOUT : ' + stdout);
        console.log('STDERR : ' + stderr);
        console.log('GIT COMMIT');
        V++;
        return;
    });
}
var gitPush = function () {
    exec('git push origin master', function (err, stdout, stderr) {
        console.log('Err : ' + err);
        console.log('STDOUT : ' + stdout);
        console.log('STDERR : ' + stderr);
        console.log('GIT PUSH');
        return;
    });
}
var main = setInterval(function () {
    gitStatus();
}, 250);
