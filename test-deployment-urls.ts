import https from 'https';

const urls = [
  'https://6cdb11c7-24d9-4547-b697-dc7f0be03508.replit.app',
  'https://workspace.arylakhotia.replit.app',
  'https://workspace-arylakhotia.replit.app'
];

async function testUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = https.request(url, { timeout: 5000 }, (res) => {
      console.log(`${url}: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log(`${url}: ERROR - ${err.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log(`${url}: TIMEOUT`);
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function findWorkingUrl() {
  console.log('Testing deployment URLs...');
  
  for (const url of urls) {
    const works = await testUrl(url);
    if (works) {
      console.log(`\nWorking URL found: ${url}`);
      return url;
    }
  }
  
  console.log('\nNo working deployment URL found');
  return null;
}

findWorkingUrl();