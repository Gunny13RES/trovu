const fs = require('fs');
const jsyaml = require('js-yaml');
const { mainModule } = require('process');

const actions = {};

function loadYmls() {
    const ymls = {};
    const ymlDirPath = '/Users/jrg/cde/web/tro/trovu-data/shortcuts/';
    const ymlFileNames = fs.readdirSync(ymlDirPath);
    for (const ymlFileName of ymlFileNames) {
        const ymlFilePath = ymlDirPath + '/' + ymlFileName;
        const ymlIn = fs.readFileSync(ymlFilePath, 'utf8');
        const shortcuts = jsyaml.load(ymlIn);
        ymls[ymlFilePath] = shortcuts;
    }
    return ymls;
}

function writeYmls(ymls) {
    for (const ymlFilePath in ymls) {
        const yml = ymls[ymlFilePath];
        const ymlStr = jsyaml.dump(yml, { noArrayIndent: true, lineWidth: -1 });
        fs.writeFileSync(ymlFilePath, ymlStr)
    }
    return ymls;
}

actions['normalize'] = async function () {
    const ymls = loadYmls();
    writeYmls(ymls);
}

async function main() {
    if (process.argv.length < 3) {
        console.log('Usage: node index.js action [path]')
        return;
    }
    const action = process.argv[2];
    if (action in actions) {
        actions[action]();
    }
    else {
        console.log('Action must be one of: ', Object.keys(actions));
    }
}

main();