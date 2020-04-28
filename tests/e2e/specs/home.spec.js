describe('Tips.vue', () => {
  const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');

  describe('Tips page', () => {
    before(() => {
      cy
        .visit('/');
    });

    it('creates new tip, navigates to home, sorts by latest, new tip is visible', () => {
      cy
        .get('.tips > a')
        .should('have.class', 'router-link-exact-active')

        .get('.overview', { timeout: 100000 })
        .should('be.visible')

        .get('.wallet-install')
        .should('not.be.visible')

        .get('.tip__post')
        .should('be.visible')

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
        .click()
        .get('.form-control')
        .last({ timeout: 50000 })
        .should('not.have.value', randomString)
        .get('.spinner-border', { timeout: 50000 })
        .should('not.be.visible')

        .get('#sort-latest')
        .click()
        .get('a.active')
        .should('contain', 'Latest')

        .get('.spinner-border', { timeout: 50000 })
        .should('not.be.visible')
        .get('.tip__note')
        .first({ timeout: 50000 })
        .should('contain', randomString)

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

    it('can retip a tip', () => {
      cy
        .wait('@getAccount', { timeout: 25000 })
        .get('.retip__icon--retip ~ span > span:first-child', { timeout: 25000 })
        .first()
        .invoke('text')
        .as('oldValue')
        .get('.retip__icon--retip')
        .first()
        .click()
        .get('.retip__container')
        .should('be.visible')
        .get('.retip__container input.retip__value')
        .first()
        .type('0.01')
        .get('.retip__container .retip__button')
        .first()
        .click()
        .get('.retip__wrapper')
        .should('be.visible')
        .get('.retip__container', { timeout: 100000 })
        .should('not.be.visible')
        .get('.spinner-border', { timeout: 50000 })
        .should('not.be.visible')
        .get('@oldValue')
        .then((oldValue) => cy
          .get('.retip__icon--retip ~ span > span:first-child', { timeout: 15000 })
          .first()
          .invoke('text')
          .should('not.equal', oldValue));
    });
  });
});
