const fs = require('fs');
const jsyaml = require('js-yaml');
const isValidDomain = require('is-valid-domain')

const actions = {};

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

function loadYmls() {
    const ymls = {};
    const ymlDirPath = '/Users/jrg/cde/web/tro/trovu-data/shortcuts/';
    const ymlFileNames = fs.readdirSync(ymlDirPath);
    for (const ymlFileName of ymlFileNames) {
        const ymlFilePath = ymlDirPath + ymlFileName;
        const ymlStr = fs.readFileSync(ymlFilePath, 'utf8');
        const shortcuts = jsyaml.load(ymlStr);
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

const isValidUrl = urlString => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
}

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 5000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

actions['removeDeadDomains'] = async function () {
    const ymlsAll = loadYmls();
    const ymls = {};
    const ymlFilePath = '/Users/jrg/cde/web/tro/trovu-data/shortcuts/old-o.yml';
    ymls[ymlFilePath] = ymlsAll[ymlFilePath];
    for (const ymlFilePath in ymls) {
        const yml = ymls[ymlFilePath];
        for (const key in yml) {
            const shortcut = yml[key];
            if (!isValidUrl(shortcut.url)) {
                console.log(shortcut.url + ' is not a valid url, skipping.');
                continue;
            }
            const url = new URL(shortcut.url);
            if (!isValidDomain(url.hostname)) {
                console.log(url.host + ' is not a valid hostname, skipping.');
                continue;
            }
            console.log(url.host);
            const testUrl = url.protocol + '//' + url.host;
            try {
                console.log(testUrl, "...");
                const response = await fetchWithTimeout(testUrl);
                console.log(response.status, testUrl);
                if (response.status != 200) {
                    delete yml[key];
                }
            }
            catch (error) {
                console.error(error);
                delete yml[key];
            }
        }
    }
    writeYmls(ymls);
}

main();