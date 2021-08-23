describe('Tests about tip/post view', () => {
  before(() => {
    cy.visit('/tip/1');
  });

  it('renders the tip or post preview', () => {
    cy
      .get('.title', { timeout: 15000 })
      .should('be.visible')
      .get('.retip__wrapper')
      .should('be.visible')
      .get('.retip__wrapper')
      .should('contain.text', '0.1');
  });

  it('pins the tip to the user channel, navigate to the channel and the pinned item is present', () => {});
  it('can report a tip', () => {});
  it('can can claim a tip', () => {});

  it('plays embeded videos if user allowed 3rd party cookies', () => {});
  it('does not play video if user did not allow cookies, shows popup', () => {});

  const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');

  it('shows comments for a record', () => {});

  it.skip('can post a comment', () => {
    // Needs backend implementation
    cy
      .get('.form-control')
      .type(randomString)
      .get('.btn')
      .click();
  });

  describe('Posts without tip', () => {
    it('shows images preview, open image gallery and navigate through it', () => {});
  });

  describe('User preview', () => {
    it('shows user info when hover on tip author avatar or adress', () => {});
  });
});
