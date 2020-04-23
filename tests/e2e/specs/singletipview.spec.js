describe('TipRecord.vue', () => {
  before(() => {
    cy.visit('/#/tip/1');
  });

  it('сontent is visible', () => {
    cy
      .get('.title', { timeout: 15000 })
      .should('be.visible')
      .get('.preview__image')
      .should('be.visible');
  });

  const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');
  it.skip('can post a comment', () => {
    // Needs backend implementation
    cy
      .get('.form-control')
      .type(randomString)
      .get('.btn')
      .click();
  });
});
