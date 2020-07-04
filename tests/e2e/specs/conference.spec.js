describe('Conference.vue', () => {
  const ROOM_NAME = 'SOME_VALID_ROOM_NAME_1234567890$()[]-+{><}^';
  // regarding to the https://github.com/aeternity/jitsi-meet/blob/80463517e9216cbb2e51d08bb69f5477af005bdb/react/features/welcome/components/WelcomePage.web.js#L23
  const isValid = ROOM_NAME.match(/^[^?&:\u0022\u0027%#]+$/);

  before(() => {
    if (!isValid) {
      throw new Error('const ROOM_NAME is not valid');
    }
    cy.visit(`/league/${ROOM_NAME}`);
  });

  it('set the correct iframe path by Vue route', () => {
    cy
      .get('#jitsiConferenceFrame0')

      .should('exist')
      .should('have.attr', 'src')
      // check if that just contains ROOM_NAME
      .and('contains', ROOM_NAME)

      // cut all from iframe src after # symbol
      .then((url) => url.substring(0, url.indexOf('#')))
      // check if it's equals
      .should('be.eq', `https://${Cypress.env('JITSI_DOMAIN')}/${ROOM_NAME}`);
  });
});
