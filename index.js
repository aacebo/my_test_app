const { KApp } = require('@kustomer/apps-server-sdk');
const pkg = require('./package.json');

(async () => {
  const app = new KApp({
    app: pkg.name,
    version: pkg.version,
    title: 'Delighted (SDK)',
    iconUrl: 'https://cdn.glitch.global/623038c7-b614-42ff-ba4d-9cfe2753f237/icon.png?v=1654869205164',
    description: `Automatically retrieve survey results from Delighted and display NPS data in the timeline. \n
Use the Delighted app integration to allow agents to see a customer's NPS survey results from within the Kustomer timeline. The Delighted integration automatically creates and updates customer records whenever your customers submit an NPS survey through Delighted. This allows your team to have access to critical voice-of-customer data that can help set the tone for support interactions.
**Delighted** is a customer feedback platform that provides a seamless way to collect and analyze customer feedback with Net Promoter Score (NPS). \n
Learn more about the integration in the [Kustomer Help Center](https://help.kustomer.com/integrate-with-delighted-rku8RKIWt).`,
    clientId: '7b00e61887ea157d25512967d761a802',
    clientSecret: '7615e0cf6c0fd6df16f216057dc2bd56',
    roles: [
      'org.user.customer.read',
      'org.user.customer.write',
      'org.user.kobject.write',
      'org.permission.customer.read',
      'org.permission.customer.create',
      'org.permission.customer.update',
      'org.permission.kobject.create',
      'org.permission.kobject.kobject_*.create'
    ],
    url: 'https://delighted.glitch.me',
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

  app.withKlass('net-promoter-score', {
    icon: 'scoreboard',
    color: '#FF0000',
    metadata: {
      properties: {
        scoreNum: { displayName: 'Score' },
        purchaseAmountNum: { displayName: 'Purchase Amount' },
        commentTxt: { displayName: 'Comment' },
        updatedAt: { displayName: 'Updated' }
      }
    }
  });

  // app.withCustomView('timeline', '/views/timeline', {
  //   context: 'expanded-timeline',
  //   resource: 'kobject',
  //   klass: 'net-promoter-score'
  // });

  app.onHook('nps', async (orgId, data) => {
    let customer = await app.in(orgId).customers.getByEmail(data.event_data.person.email);

    if (!customer) {
      customer = await app.in(orgId).customers.create({
        name: data.event_data.person.name,
        emails: [{
          email: data.event_data.person.email,
          type: 'home',
          verified: true
        }],
        custom: {
          latestNpsNum: data.event_data.score
        }
      });
    } else {
      customer = await app.in(orgId).customers.update(customer.id, {
        custom: {
          latestNpsNum: data.event_data.score
        }
      });
    }

    await app.in(orgId).customers.createKObject(customer.id, 'net-promoter-score', {
      title: `Delighted Rating ${data.event_data.score}`,
      description: data.event_data.comment,
      custom: {
        updatedAt: new Date(data.event_data.updated_at),
        scoreNum: data.event_data.score,
        commentTxt: data.event_data.comment
      }
    });
  });

  try {
    await app.start(
      process.env.PORT || 80,
      process.env.NODE_ENV === 'local'
    );

    // const token = await app.in('aacebo').getToken();
    // app.log.info(token);
  } catch (err) {
    app.log.error(JSON.stringify(err, undefined, 2));
  }
})();
