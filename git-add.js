var exec = require('child_process').exec;
var V = 100;
var isPaused = false;
var gitStatus = function () {
    if (isPaused){
        return console.log('Paused');
    }
    console.log('Not paused...');
    exec('git status .', function (err, stdout, stderr) {
        var status = stdout.split('\n')[2];
        console.log('Err : ' + err);
        console.log('STDOUT : ' + status);
        console.log('STDERR : ' + stderr);
        if (status == 'Untracked files:' || status == 'Changes not staged for commit:') {
            console.log("Untracked");
            gitAdd();
        } else if (status == "Changes to be committed:") {
            gitCommit();
        } else if (status == '  (use "git push" to publish your local commits)') {
            gitPush();
        }
        return;
    });
}
var gitAdd = function () {
    isPaused = true;
    exec('git add .', function (err, stdout, stderr) {
        if (err){
            return console.log('GIT ADD EXEC ERR : ' + err);
        }
        if (stderr){
            return console.log('GIT ADD STDERR : ' + stderr);
        }
        console.log('STDOUT : ' + stdout);
        isPaused = false;
        
        return;
    });
    
}
var gitCommit = function () {
    isPaused = true;
    exec('git commit -m "Auto push V' + JSON.stringify(V).split('').join('.') + '"', function (err, stdout, stderr) {
        console.log('Err : ' + err);
        console.log('STDOUT : ' + stdout);
        console.log('STDERR : ' + stderr);
        console.log('GIT COMMIT');
        V++;
        isPaused = false;
        return;
    });
}
var gitPush = function () {
    isPaused = true;
    exec('git push origin master', function (err, stdout, stderr) {
        console.log('Err : ' + err);
        console.log('STDOUT : ' + stdout);
        console.log('STDERR : ' + stderr);
        console.log('GIT PUSH');
        isPaused = false;
        return;
    });
}
var main = setInterval(function () {
    gitStatus();
}, 1000);
