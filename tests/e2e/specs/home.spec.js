describe('Home.vue', () => {
  describe('overall view', () => {
    before(() => {
      cy.visit('/');
    });
    it('Home should be active', () => {
      cy.get(':nth-child(1) > a > span').should('have.class', 'active');
    });
    it('Should show aggregated data', () => {
      cy.get(':nth-child(1) > .overview__value').should('be.visible');
    });
    it('Wallet Install is hidden on found wallet', () => {
      cy.get('.wallet-install').should('not.be.visible');
    });
    it('Tip mask is shown on found wallet', () => {
      cy.get('.tip__post').should('be.visible');
    });
  });

  describe('create tip', () => {
    const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');
    it('Should create tip', () => {
      cy.get('.col-md-4 > .input-group > .form-control').type('0.1');
      cy.get('.col-md-8 > .form-control').type('https://aeternity.com');
      cy.get(':nth-child(3) > .form-control').type(randomString, { force: true });
      cy.get('.btn').click();
    });

    it('Created tip should be visible', () => {
      cy.contains(randomString, { timeout: 10000 }).should('be.visible');
    });

    it('Tip should navigate to SingleTipView', () => {
      cy.contains(randomString).click();
      cy.url().should('contain', '/tip/');
    });
  });

  describe('retip', () => {
    before(() => {
      cy.visit('/');
      cy.server();
      cy.route('/v2/accounts/ak_fUq2NesPXcYZ1CcqBcGC3StpdnQw3iVxMA3YSeCNAwfN4myQk').as('getAccount');
    });
    it('Should be able to retip tip', () => {
      cy.wait('@getAccount');
      // Define route here so we do not trigger it while loading initially
      cy.route('POST', '/v2/debug/transactions/dry-run').as('dryRun');
      cy.get('.tip__amount .retip__icon').first().click();
      cy.get('.retip__container').should('be.visible');
      cy.get('.retip__container input').type('0.01');
      cy.get('.retip__container .btn').click();
      cy.wait('@dryRun', { requestTimeout: 10000 });
      cy.get('.retip__wrapper').should('be.visible');
      cy.get('.retip__container').should('not.be.visible');
    });
  });
});
