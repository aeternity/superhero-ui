describe('Home.vue', () => {
  const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');

  describe('Home page', () => {
    before(() => {
      cy.visit('/');
    });

    it('navigation link is active', () => {
      cy
        .get('.home > a')
        .should('have.class', 'router-link-exact-active');
    });

    it('shows aggregated data', () => {
      cy
        .get('.overview', { timeout: 15000 })
        .should('be.visible');
    });

    it('hides Wallet Install on wallet found', () => {
      cy
        .get('.wallet-install')
        .should('not.be.visible');
    });

    it('shows Tip mask on wallet found', () => {
      cy
        .get('.tip__post')
        .should('be.visible');
    });

    it('can create tip', () => {
      cy
        .get('.form-control')
        .first()
        .type('0.1')
        .get('.form-control')
        .eq(1)
        .type('https://aeternity.com')
        .get('.form-control')
        .last()
        .type(randomString, { force: true })
        .get('.tip__send')
        .click();
    });

    it('new tip is visible', () => {
      cy
        .contains(randomString, { timeout: 50000 })
        .should('be.visible');
    });

    it('new tip can navigate to SingleTipView', () => {
      cy
        .contains(randomString)
        .click()
        .url()
        .should('contain', '/tip/');
    });
  });

  describe('Retip', () => {
    before(() => {
      cy
        .visit('/')
        .server()
        .route('/v2/accounts/ak_fUq2NesPXcYZ1CcqBcGC3StpdnQw3iVxMA3YSeCNAwfN4myQk').as('getAccount');
    });

    it('can retip tip', () => {
      cy
        .wait('@getAccount', { timeout: 15000 })
      // Define route here so we do not trigger it while loading initially
        .route('POST', '/v2/debug/transactions/dry-run')
        .as('dryRun')
        .get('.retip__wrapper .retip__icon--tip')
        .first()
        .click()
        .get('.retip__container')
        .should('be.visible')
        .get('.retip__container input.retip__message')
        .first()
        .type(randomString)
        .get('.retip__container input.retip__value')
        .first()
        .type('0.01')
        .get('.retip__container .retip__button')
        .first()
        .click()
        .wait('@dryRun', { requestTimeout: 50000 })
        .get('.retip__wrapper')
        .should('be.visible')
        .get('.retip__container')
        .should('not.be.visible');
    });
  });
});
