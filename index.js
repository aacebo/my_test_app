const { KApp } = require('@kustomer/apps-server-sdk');
const pkg = require('./package.json');

(async () => {
  const app = new KApp({
    app: pkg.name,
    version: pkg.version,
    title: 'Delighted (SDK)',
    iconUrl: 'https://cdnapps.helpapp.io/delighted/images/icon.png',
    description: `
      Automatically retrieve survey results from Delighted and display NPS data in the timeline. \n
      Use the Delighted app integration to allow agents to see a customer's NPS survey results from within the Kustomer timeline. The Delighted integration automatically creates and updates customer records whenever your customers submit an NPS survey through Delighted. This allows your team to have access to critical voice-of-customer data that can help set the tone for support interactions.
      **Delighted** is a customer feedback platform that provides a seamless way to collect and analyze customer feedback with Net Promoter Score (NPS). \n
      Learn more about the integration in the [Kustomer Help Center](https://help.kustomer.com/integrate-with-delighted-rku8RKIWt).
    `,
    clientId: '7b00e61887ea157d25512967d761a802',
    clientSecret: '7615e0cf6c0fd6df16f216057dc2bd56',
    roles: ['org.admin'],
    url: 'https://my-test-app.onrender.com',
    env: 'qa',
    dependencies: ['kustomer-^1.8.16'],
    screenshots: [],
    appDetails: {
      appDeveloper: {
        name: 'Kustomer',
        website: 'https://kustomer.com',
        supportEmail: 'support@kustomer.com',
      },
      externalPlatform: {
        name: 'Delighted',
        website: 'https://delighted.com',
      },
    },
    changelog: {
      [pkg.version]: 'testing123'
    },
    visibility: 'public',
    system: false,
    default: false
  });

  app.onHook('nps', (orgId, data) => {
    app.log.info(orgId);
    app.log.info(data);
  });

  try {
    await app.start(process.env.PORT || 80, process.env.NODE_ENV === 'local');
  } catch (err) {
    app.log.error(JSON.stringify(err, undefined, 2));
  }
})();
