const axios = require('axios').default;

const packageName = require('../package.json').name;

const syncPackageName = process.argv.slice(process.argv.length - 1);

let logId = null;

function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function syncPackage() {
  const url = `https://registry-direct.npmmirror.com/${syncPackageName}/sync?sync_upstream=true`;

  const res = await axios.put(url);
  if (res.data.ok) {

    logId = res.data.logId;
    getSyncResult();

  } else {
    console.error(`[${packageName}]==== Failed sync npm package to npmmirror (taobao)  ====`);
  }

}

async function getSyncResult() {
  const url = `https://registry-direct.npmmirror.com/${syncPackageName}/sync/log/${logId}`;

  const res = await axios.get(url);
  if (!res.data) {
    console.error(`[${packageName}]==== Unexpected result ====`);
    return;
  }
  if (!res.data.syncDone) {
    await wait(2000);
    await getSyncResult();
  }
  if (res.data.syncDone) {
    console.log(`[${packageName}]==== Sync npm package to npmmirror (taobao) successfully ====`);
  }
}


syncPackage();