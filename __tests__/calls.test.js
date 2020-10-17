const docroot = "http://l.tro:8080/process/index.html?#debug=1";

const yaml = require("js-yaml");
const fs = require("fs");

const calls = yaml.safeLoad(fs.readFileSync("./__tests__/calls.yml", "utf8"));

for (const call of calls) {
  test(JSON.stringify(call), async () => {
    await testCall(call);
  });
}
async function testCall(call) {
  const url = setCallUrl(call);
  await page.goto(url);
  await page.reload();
  await checkIfRedirectUrlPresent(call.expectedRedirectUrl);
}

async function checkIfRedirectUrlPresent(expectedRedirectUrl) {
  await page.waitForFunction('document.querySelector("body").innerText.includes("Redirect to:")');
  await expect(page.content()).resolves.toMatch(expectedRedirectUrl.replace(/&/g, "&amp;"));
}

function setCallUrl(call) {
  let url = docroot;
  for (let paramName of ["language", "country", "github", "query"]) {
    if (paramName in call) {
      url += "&" + paramName + "=" + encodeURIComponent(call[paramName]);
    }
  }
  return url;
}