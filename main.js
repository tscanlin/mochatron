const spawn = require('npm-execspawn');
const url = process.argv[1];

var app = spawn('electron' + ' ./app.js');

app.stderr.pipe(process.stderr);
app.stdout.pipe(process.stdout);
