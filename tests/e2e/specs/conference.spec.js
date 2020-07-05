describe('Conference.vue', () => {
  const ROOM_NAME = 'SOME_VALID_ROOM_NAME_1234567890$()[]-+{><}^!@$_()';
  // regarding to the https://github.com/aeternity/jitsi-meet/blob/80463517e9216cbb2e51d08bb69f5477af005bdb/react/features/welcome/components/WelcomePage.web.js#L23
  const isValid = ROOM_NAME.match(/^[^?&:\u0022\u0027%#]+$/);

  before(() => {
    if (!isValid) {
      throw new Error('const ROOM_NAME is not valid');
    }
    cy.visit(`/league/${ROOM_NAME}`);
  });

  it('set the correct iframe path by Vue route', () => {
    const options = 'jitsi_meet_external_api_id=0&config.disableDeepLinking=false';

    cy
      .get('#jitsiConferenceFrame0')
      // check if
      .should('exist')
      // it's an iframe because it
      .should('have.attr', 'src')
      // and src value should be equals
      .should('be.eq', `https://${Cypress.env('JITSI_DOMAIN')}/${ROOM_NAME}#${options}`);
  });
});
