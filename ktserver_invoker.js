/**
 * ktserver_invoker.js
 * @fileoverview for unit test tool.
 *
 * @author kazuya kawaguchi <kawakazu80@gmail.com>
 */


//
// import(s)
//

var child_process = require('child_process');
var readline = require('readline');


// 
// common(s)
//
function run_ktserver(options, callback) {

  try {

    var options = options || {};
    var args = [];
    if (options.host) {
      args.push('-host');
      args.push(options.host);
    }
    if (options.port) {
      args.push('-port');
      args.push(options.port);
    }

    var ktserver = child_process.spawn('ktserver', args);
    if (!ktserver) {
      callback({
        message: 'failed create ktserver child process',
      });
      return;
    }

    ktserver.on('exit', function (code) {
      ktserver.stdin.end();
    });

    callback(null, ktserver);

  } catch (e) {
    callback(e);
  }
}


//
// main
//

var invokers = [];
var command_pattern = [
  {}, // for new
  { port: 1979, host: 'localhost', }, // for new
  { port: 1980, }, // for set
  { port: 1981, }, // for set
  { port: 1982, }, // for get
  { port: 1983, }, // for destroy
  { port: 1984, }, // for length
  { port: 1985, }, // for clear
  { port: 9999, }, // for error
];

command_pattern.forEach(function (command) {
  run_ktserver(command, function (err, ktserver) {
    if (!err) {
      console.log('invoking ' + ktserver.pid + ' ...');
      invokers.push(ktserver);
    }
  });
});


var rl = readline.createInterface(process.stdin, process.stdout);
rl.question('Stop ?', function (answer) {
  if (answer) {
    invokers.forEach(function (ktserver) {
      console.log('stopping ' + ktserver.pid + ' ...');
      ktserver.kill();
    });
    process.exit();
  }
});

