/* eslint-disable @typescript-eslint/no-var-requires */
const mailchimp = require('@mailchimp/mailchimp_marketing');
const listId = 'ac3549277c';

(async () => {
  mailchimp.setConfig({
    apiKey: '6faa92d1712b80af41a0f60dfcbeb2ff-us5',
    server: 'us5',
  });
  /* const response = await mailchimp.lists.tagSearch(listId);
  response.tags.forEach(console.log); */
  try {
    const response = await mailchimp.lists.addListMember('ac3549277c', {
      email_address: 'funmiayinde11@gmail.com',
      status: 'subscribed',
      email_type: 'html',
      tags: ['Pre-Launch'],
    });
    console.log({ response });
  } catch (e) {
    console.log(e);
  }
  // const response = await mailchimp.lists.getAllLists();
  // console.log(response);
})();
