/**
 * A Lambda function that logs the payload received from SNS.
 */
exports.snsPayloadLoggerHandler = async (event, context) => {
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log(event);
}

const os = require('os')

const inputFile = process.env.INPUT_FILE
const efsPath = process.env.EFS_PATH

const { exec } = require('child_process')

const execPromise = async (command) => {
	console.log(command)
	return new Promise((resolve, reject) => {
		const ls = exec(command, function (error, stdout, stderr) {
		  if (error) {
		    console.log('Error: ', error)
		    reject(error)
		  }
		  console.log('stdout: ', stdout);
		  console.log('stderr: ' ,stderr);
		})
		
		ls.on('exit', function (code) {
		  console.log('Finished: ', code);
		  resolve()
		})
	})
}

// The Lambda handler
exports.handler = async function (eventObject, context) {
	await execPromise(`/opt/bin/ffmpeg -loglevel error -i ${efsPath}/${inputFile} -s 240x135 -vf fps=1 ${efsPath}/%d.jpg`)
}

// import json
// from pathlib import Path

// # You can reference EFS files by including your local mount path, and then
// # treat them like any other file. Local invokes may not work with this, however,
// # as the file/folders may not be present in the container.
// FILE = Path("/mnt/lambda/file")

// def lambda_handler(event, context):
//     wrote_file = False
//     contents = None
//     # The files in EFS are not only persistent across executions, but if multiple
//     # Lambda functions are mounted to the same EFS file system, you can read and
//     # write files from either function.
//     if not FILE.is_file():
//         with open(FILE, 'w') as f:
//             contents = "Hello, EFS!\n"
//             f.write(contents)
//             wrote_file = True
//     else:
//         with open(FILE, 'r') as f:
//             contents = f.read()
//     return {
//         "statusCode": 200,
//         "body": json.dumps({
//             "file_contents": contents,
//             "created_file": wrote_file
//         }),
//     }
