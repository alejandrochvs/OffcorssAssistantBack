var exec = require('child_process').exec;
var fs = require('fs');
var isPaused = true;
var V, currentPackageJson;
var gitStatus = function () {
    if (isPaused) {
        return console.log(new Date().toLocaleTimeString() + 'Paused');
    }
    exec('git status .', function (err, stdout, stderr) {
        var status = stdout.split('\n')[2];
        if (err) {
            return console.log(new Date().toLocaleTimeString() + 'GIT STATUS EXEC ERR : ' + err);
        }
        if (stderr) {
            return console.log(new Date().toLocaleTimeString() + 'GIT STATUS STDERR : ' + stderr);
        }
        console.log(new Date().toLocaleTimeString() + ': STATUS = {' + stdout + '} = STATUS');
        if (status == 'Untracked files:' || status == 'Changes not staged for commit:') {
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
    console.log(new Date().toLocaleTimeString() + 'git add .');
    exec('git add .', function (err, stdout, stderr) {
        if (err) {
            return console.log(new Date().toLocaleTimeString() + 'GIT ADD EXEC ERR : ' + err);
        }
        if (stderr) {
            return console.log(new Date().toLocaleTimeString() + ' GIT ADD STDERR : ' + stderr);
        }
        console.log(new Date().toLocaleTimeString() + ' GIT ADD STDOUT : {' + stdout + '} GIT ADD STDOUT');
        isPaused = false;
        return;
    });

}
var gitCommit = function () {
    console.log(new Date().toLocaleTimeString() + 'Commiting...');
    isPaused = true;
    V++;
    var CurrentVersion = JSON.stringify(V).split('').join('.');
    exec('git commit -m "Auto push V' + CurrentVersion + '"', function (err, stdout, stderr) {
        if (err) {
            return console.log(new Date().toLocaleTimeString() + ' GIT COMMIT EXEC ERR : ' + err);
        }
        if (stderr) {
            return console.log(new Date().toLocaleTimeString() + ' GIT COMMIT STDERR : ' + stderr);
        }
        console.log(new Date().toLocaleTimeString() + ' GIT COMMIT STDOUT : {' + stdout + '} GIT COMMIT STDOUT');
        currentPackageJson.version = CurrentVersion;
        console.log(new Date().toLocaleTimeString() + ' Current version = ' + CurrentVersion);
        console.log(new Date().toLocaleTimeString() + ' Saving file...');
        fs.writeFile('./version.json', JSON.stringify(currentPackageJson), function (err) {
            if (err) {
                return console.log(new Date().toLocaleTimeString() + err);
            }
            console.log(new Date().toLocaleTimeString() + " The file was saved!");
            isPaused = false;
            return;
        });
        return;
    });
}
var gitPush = function () {
    isPaused = true;
    exec('git push origin master', function (err, stdout, stderr) {
        if (err) {
            return console.log(new Date().toLocaleTimeString() + ' GIT PUSH EXEC ERR : ' + err);
        }
        console.log(new Date().toLocaleTimeString() + ' GIT PUSH STDOUT : {' + stdout + '} GIT PUSH STDOUT');
        isPaused = false;
        return;
    });

}

fs.readFile('./version.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(new Date().toLocaleTimeString() + err);
    }
    currentPackageJson = JSON.parse(data);
    V = Number(currentPackageJson.version.split('.').join(''));
    isPaused = false;
    return;
});
var main = setInterval(function () {
    gitStatus()
}, 5000);
