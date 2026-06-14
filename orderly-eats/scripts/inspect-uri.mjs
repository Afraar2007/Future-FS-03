const s = process.env.MONGODB_URI || 'mongodb://localhost:27017';
console.log('raw:', s);
console.log('json:', JSON.stringify(s));
console.log('codes:', [...s].map((c) => c.charCodeAt(0)).join(','));
