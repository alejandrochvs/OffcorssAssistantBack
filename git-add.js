var exec = require('child_process').exec;
var fs = require('fs');
var isPaused = true;
var V, currentPackageJson;
var gitStatus = function () {
    if (isPaused) {
        return console.log('Paused');
    }
    exec('git status .', function (err, stdout, stderr) {
        var status = stdout.split('\n')[2];
        if (err) {
            return console.log('GIT STATUS EXEC ERR : ' + err);
        }
        if (stderr) {
            return console.log('GIT STATUS STDERR : ' + stderr);
        }
        console.log('STATUS = {' + stdout + '} = STATUS');
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
    console.log('git add .');
    exec('git add .', function (err, stdout, stderr) {
        if (err) {
            return console.log('GIT ADD EXEC ERR : ' + err);
        }
        if (stderr) {
            return console.log('GIT ADD STDERR : ' + stderr);
        }
        console.log('GIT ADD STDOUT : {' + stdout + '} GIT ADD STDOUT');
        isPaused = false;
        return;
    });

}
var gitCommit = function () {
    console.log('Commiting...');
    isPaused = true;
    V++;
    var CurrentVersion = JSON.stringify(V).split('').join('.');
    exec('git commit -m "Auto push V' + CurrentVersion + '"', function (err, stdout, stderr) {
        if (err) {
            return console.log('GIT COMMIT EXEC ERR : ' + err);
        }
        if (stderr) {
            return console.log('GIT COMMIT STDERR : ' + stderr);
        }
        console.log('GIT COMMIT STDOUT : {' + stdout + '} GIT COMMIT STDOUT');
        currentPackageJson.version = CurrentVersion;
        console.log(CurrentVersion);
        console.log('Saving file...');
        fs.writeFile('./version.json', JSON.stringify(currentPackageJson), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
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
            return console.log('GIT PUSH EXEC ERR : ' + err);
        }
        console.log('GIT PUSH STDOUT : {' + stdout + '} GIT PUSH STDOUT');
        isPaused = false;
        return;
    });
    
}

fs.readFile('./version.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    currentPackageJson = JSON.parse(data);
    V = Number(currentPackageJson.version.split('.').join(''));
    isPaused = false;
    return;
});
var main = setInterval(function () {
    gitStatus()
}, 1000);
