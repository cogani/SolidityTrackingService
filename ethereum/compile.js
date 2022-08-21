const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);


compileSource('Tracking.sol')
compileSource('Campaign.sol')

function compileSource(solFile){
  console.log('Compiling', solFile);
  const sourcePath = path.resolve(__dirname, 'contracts', solFile);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const output = solc.compile(source, 1).contracts;
  console.log(output);
  console.log(`sourcePath:${sourcePath},  output:${output}`);



  for (let contract in output) {
    console.log(' ... Compiling contract', contract);
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(':', '') + '.json'),
      output[contract]
    );
  }
}
