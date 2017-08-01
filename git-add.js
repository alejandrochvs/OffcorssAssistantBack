var exec = require('child_process').exec;
exec('git status .', function (err, stdout, stderr) {
    console.log('Err : ' + err);
    var status = stdout.split('\n')[2];
    console.log('STDOUT : ' + status);
    console.log('STDERR : ' + stderr);
    if (status == 'Untracked files:'){
        console.log('GIT ADD');
    }else if (status == "Changes to be committed:"){
        console.log('GIT COMMIT');
    }
    return;
    
});
exec('git add .', function (err, stdout, stderr) {
    console.log('Err : ' + err);
    console.log('STDOUT : ' + stdout);
    console.log('STDERR : ' + stderr);
    return;
});
