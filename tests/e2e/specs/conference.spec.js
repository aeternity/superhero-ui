describe('Conference.vue', () => {
  const ROOM_NAME = 'SOME_VALID_ROOM_NAME_1234567890$()[]-+{><}^';
  // the same as we have at jitsi create room form and at https://github.com/aeternity/jitsi-meet/blob/80463517e9216cbb2e51d08bb69f5477af005bdb/react/features/welcome/components/WelcomePage.web.js#L23
  const isValid = ROOM_NAME.match(/^[^?&:\u0022\u0027%#]+$/);

  before(() => {
    if (!isValid) {
      throw new Error('const ROOM_NAME is not valid');
    }
    cy.visit(`/league/${ROOM_NAME}`);
  });

  it('set the correct iframe path by Vue route', () => {
    cy.get('#jitsiConferenceFrame0')
      .should('exist')
      .should('have.attr', 'src')
      .and('contains', ROOM_NAME);
  });
});
