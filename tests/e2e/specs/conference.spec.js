describe('Conference.vue', () => {
  const ROOM = 'SOME_ROOM_NAME';
  // the same as we have at jitsi create room form
  const isValidName = ROOM.match(/^[^?&:"'%#]+$/);
  // not sure how to read .env
  const DOMAIN = 'test.league.aeternity.org';

  const INCOME_DATA_ERROR = 'const ROOM is not not valid';

  before(() => {
    if (isValidName) {
      cy.visit(`/league/${ROOM}`);
    } else {
      throw new Error(INCOME_DATA_ERROR);
    }
  });

  it('set the correct iframe path by Vue route', () => {
    if (isValidName) {
      cy.get('#jitsiConferenceFrame0')
        .should('exist')
        .should('have.attr', 'src')
        .should('contains', `https://${DOMAIN}/${ROOM}`);
    } else {
      throw new Error(INCOME_DATA_ERROR);
    }
  });
});
