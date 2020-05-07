import * as core from '@actions/core'
import * as fs from 'fs'
import * as AWS from 'aws-sdk'

async function run(): Promise<void> {
  try {
    const packageName = core.getInput('package')
    const functionName = core.getInput('function-name')

    if (packageName === undefined || packageName.length <= 0) {
      core.setFailed('No package name provided')
      return
    }

    // Set up the SDK
    const lambda = new AWS.Lambda()

    let zipBuffer: Buffer
    // Read the package
    try {
      zipBuffer = fs.readFileSync(`./${packageName}`)
    } catch (e) {
      core.setFailed(e.message)
      return
    }

    const params = {
      FunctionName: functionName,
      Publish: true,
      ZipFile: zipBuffer
    }

    lambda.updateFunctionCode(params, err => {
      if (err) {
        core.setFailed(err.message)
      }
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
