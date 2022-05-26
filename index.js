const { KApp } = require('@kustomer/apps-server-sdk');
const pkg = require('./package.json');

(async () => {
  const app = new KApp({
    app: pkg.name,
    version: pkg.version,
    title: pkg.name,
    description: pkg.description,
    clientId: 'c2479683d727e9aab29981c41be5c891',
    clientSecret: '74b77494c879c5dd3c622fe502e178f4',
    roles: ['org.admin'],
    url: 'https://98.116.161.71:3000',
    env: 'qa',
    appDetails: {
      appDeveloper: {
        name: 'Kustomer',
        website: 'https://kustomer.com',
        supportEmail: 'support@kustomer.com'
      },
      externalPlatform: {
        name: 'Delighted',
        website: 'https://delighted.com'
      }
    },
    changelog: {
      [pkg.version]: 'testing123'
    },
    visibility: 'public',
    system: false,
    default: false
  });

  try {
    await app.start(3000, false);
  } catch (err) {
    app.log.error(JSON.stringify(err, undefined, 2));
  }
})();
