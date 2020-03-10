describe('TipRecord.vue', function () {
  before(() => {
    cy.visit('/#/tip/1');
  })

  it('Content should be visible', () => {
    cy.get('.title > span').should('be.visible');
    cy.get('.tip__amount').should('be.visible');
    cy.get('.tip__amount').should('contain.text', '0.1');
  });

  const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('')
  it('Should be able to post comment', () =>  {
    cy.get('.form-control').type(randomString)
    cy.get('.btn').click();
  })

});
