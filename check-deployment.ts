// Check actual deployment URL
console.log('Environment variables:');
console.log('REPLIT_DOMAINS:', process.env.REPLIT_DOMAINS);
console.log('REPL_ID:', process.env.REPL_ID);
console.log('REPL_SLUG:', process.env.REPL_SLUG);
console.log('REPL_OWNER:', process.env.REPL_OWNER);

// Try different URL patterns
const replitId = process.env.REPL_ID;
const replitSlug = process.env.REPL_SLUG;
const replitOwner = process.env.REPL_OWNER;

console.log('\nPossible deployment URLs:');
if (replitId) {
  console.log(`1. https://${replitId}.replit.app`);
}
if (replitSlug && replitOwner) {
  console.log(`2. https://${replitSlug}.${replitOwner}.replit.app`);
  console.log(`3. https://${replitSlug}-${replitOwner}.replit.app`);
}

// Extract from development domain
const devDomain = process.env.REPLIT_DOMAINS;
if (devDomain) {
  const match = devDomain.match(/([a-f0-9-]+)-00-/);
  if (match) {
    const appId = match[1];
    console.log(`4. https://${appId}.replit.app`);
  }
}