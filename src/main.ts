import * as core from '@actions/core'
import * as fs from 'fs'
import * as AWS from 'aws-sdk'

async function run(): Promise<void> {
  try {
    const packageName = core.getInput('package')
    const functionName = core.getInput('function-name')

    // Set up the SDK
    const lambda = new AWS.Lambda()

    // Read the package
    let zipBuffer = fs.readFileSync(`./${packageName}`)

    const params = {
      FunctionName: functionName,
      Publish: true,
      ZipFile: zipBuffer
    }

    lambda.updateFunctionCode(params, err => {
      if (err) {
        console.error(err)
        core.setFailed(err.message)
      }
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
