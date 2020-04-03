describe('Home.vue', () => {
  const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');
  const testTipAmount = 0.1;
  const testRetipAmount = 0.01;
  const testUrl = 'https://aeternity.com';

  describe('Home page', () => {
    before(() => {
      cy
        .visit('/');
    });

    it('creates new tip, navigates to home, sorts by latest, new tip is visible, can retip a tip', () => {
      cy
        .get('.home > a')
        .should('have.class', 'router-link-exact-active')

        .get('.overview', { timeout: 100000 })
        .should('be.visible')

        .get('.wallet-install')
        .should('not.be.visible')

        .get('.tip__post')
        .should('be.visible')

        .get('.form-control')
        .first()
        .type(testTipAmount)
        .get('.form-control')
        .eq(1)
        .type(testUrl)
        .get('.form-control')
        .last()
        .type(randomString, { force: true })
        .get('.tip__send')
        .click()
        .wait(10000)
        .then(($btn) => {
          if (!$btn.is(':disabled')) {
            cy.wrap($btn).click();
          }
        });

      cy
        .get('.form-control')
        .last({ timeout: 100000 })
        .should('not.have.value', randomString)

        .get('#sort-latest')
        .click()
        .get('a.active')
        .should('contain', 'Latest')

        .get('.tip__note')
        .first({ timeout: 100000 })
        .should('contain', randomString)

        .contains(randomString)
        .click()
        .url()
        .should('contain', '/tip/')

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
        .type(testRetipAmount)
        .get('.retip__container .retip__button')
        .first()
        .click()
        .get('.retip__wrapper')
        .should('be.visible')
        .wait(15000)
        .get('body')
        .then(($body) => {
          if (!$body.find('div.retip__container')) {
            console.log($body.find('div.navigation__item.home'));
            cy.wrap($body.find('div.navigation__item.home > a > span')[0]).click({ force: true });
          }
        });
      cy
        .get('@oldValue')
        .then((oldValue) => cy
          .get('.retip__icon--retip ~ span > span:first-child')
          .first({ timeout: 50000 })
          .invoke('text')
          .should('not.equal', oldValue));
    });
  });
});
