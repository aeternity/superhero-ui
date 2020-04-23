describe('Home.vue', () => {
  const randomString = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');
  const testTipAmount = 0.1;
  const testTipUrl = 'https://aeternity.com';
  const testRetipAmount = 0.01;

  describe('Home page', () => {
    before(() => {
      cy
        .visit('/');
    });

    it('creates new tip, navigates to home, sorts by latest, new tip is visible', () => {
      cy
        .get('.home > a')
        .should('have.class', 'router-link-exact-active')

        .get('.overview', { timeout: 10000 })
        .should('be.visible')

        .get('.balance.text-ellipsis', { timeout: 20000 })
        .should('be.visible')

        .get('.tip__post')
        .should('be.visible')

        .get('.form-control.comment')
        .first()
        .type(randomString)
        .get('.form-control')
        .eq(1)
        .type(testTipUrl)
        .get('.form-control')
        .last()
        .clear()
        .type(testTipAmount, { force: true })
        .get('.text-right> .ae-button')
        .wait(1000)
        .click()
        .wait(5000)
        .then(($btn) => {
          if (!$btn.is(':disabled')) { // We unable to tip from one account at the same time
            cy.wait(25000);
            cy
              .get('.form-control.comment')
              .first()
              .clear()
              .type(randomString)
              .get('.form-control')
              .eq(1)
              .clear()
              .type(testTipUrl)
              .get('.form-control')
              .last()
              .clear()
              .type(testTipAmount, { force: true })
              .get('.text-right> .ae-button')
              .wait(1000)
              .click();
          }
        });
      cy
        .get('.form-control.comment')
        .first({ timeout: 50000 })
        .should('not.have.value', randomString)

        .get('#sort-latest')
        .click()
        .get('a.active')
        .should('contain', 'Latest')

        .get('.tip__note', { timeout: 50000 })
        .should('contain', randomString)

        .contains(randomString)
        .click()
        .url()
        .should('contain', '/tip/');
    });

    it('can retip a tip', () => {
      cy
        .get('.tip__amount .ae-amount-fiat > span:first-child', { timeout: 25000 })
        .first()
        .invoke('text')
        .as('oldValue')
        .get('.tip__amount .ae-amount-fiat')
        .first()
        .click()
        .get('.tip__container')
        .should('be.visible')
        .get('.tip__container input.form-control')
        .first()
        .clear()
        .type(testRetipAmount)
        .get('.tip__container .ae-button')
        .first()
        .wait(1000)
        .click()
        .get('.tip__container', { timeout: 100000 })
        .should('not.be.visible')
        .get('@oldValue')
        .then((oldValue) => cy
          .get('.tip__amount .ae-amount-fiat > span:first-child', { timeout: 15000 })
          .first()
          .invoke('text')
          .should('not.equal', oldValue));
    });
  });
});
