import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

///
/// use this script as the value for --extensionTestsPath argument
/// (do call this script directly - use runTest for that.)
/// 

export function run(): Promise<void> {
	console.log(`Running tests.`);
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((accept, reject) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err: unknown, files: string[]) => {
			if (err) {
				console.error("error globbing tests.", err);
				return reject(err);
			}

			// Add files to the test suite
			console.log(`adding ${files.length} files to test-suite.`);
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(failures => {
					if (failures > 0) {
						console.log(`Tests failed. There were ${failures} failed tests.`);
						reject(new Error(`${failures} tests failed.`));
					} else {
						accept();
					}
				});
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	});
}
