var spawn = require('npm-execspawn');
var url = process.argv[1];

var app = spawn('electron' + ' ./lib/app.js');

app.stderr.pipe(process.stderr);
app.stdout.pipe(process.stdout);
