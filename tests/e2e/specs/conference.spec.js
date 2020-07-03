describe('Conference.vue', () => {
  const ROOM_NAME = 'SOME_ROOM_NAME';
  // the same as we have at jitsi create room form
  const isValid = ROOM_NAME.match(/^[^?&:"'%#]+$/);

  before(() => {
    if (!isValid) {
      throw new Error('const ROOM_NAME is not not valid');
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
