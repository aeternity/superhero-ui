describe('Conference.vue', () => {
  const ROOM = 'SOME_ROOM_NAME';
  const isValidName = ROOM.match(/^[^?&:"'%#]+$/);
  // not sure how to read .env
  const DOMAIN = 'test.league.aeternity.org';

  before(() => {
    if (isValidName) {
      cy.visit(`/league/${ROOM}`);
    }
  });

  it('set the correct iframe path by Vue route', () => {
    if (isValidName) {
      cy.get('#jitsiConferenceFrame0')
        .should('exist')
        .should('have.attr', 'src')
        .and('contains', `https://${DOMAIN}/${ROOM}`);
    }
  });
});
