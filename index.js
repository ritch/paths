var child_process = require('child_process');
var exec = child_process.exec;
var fs = require('fs');
var path = require('path');

var addIndex = process.argv.indexOf('add');
var profile = process.env.HOME + '/.profile';
var pathsStart = '#[paths]\nexport PATH=';
var pathsEnd = ':$PATH\n#[/paths]';

if(addIndex > -1) {
	
	var path = path.resolve(process.argv[addIndex + 1]);
	console.log('ADDING', path);
	fs.readFile(profile, function (err, data) {
		
		var contents = data.toString();
		var pathsStartIndex = contents.indexOf(pathsStart);
		var pathsEndIndex = contents.indexOf(pathsEnd);
		
		if(pathsStartIndex === -1 && pathsEndIndex === -1) {
			// create
			contents = contents + '\n' + pathsStart + path + pathsEnd;
		} else {
			// update
			contents = contents.replace(pathsStart, pathsStart + path + ':');
		}
		
		fs.writeFile(profile, contents, function () {
			console.log('You must restart this shell to use commands in', path);
		});
		
	});
	
} else {
	exec('echo $PATH', function(err, paths) {
		console.log('\nPATHS');
		console.log(paths.replace(/:/g, '\n'));
	});
}