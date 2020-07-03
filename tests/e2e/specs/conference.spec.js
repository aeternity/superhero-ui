describe('Conference.vue', () => {
  const ROOM = 'SOME_ROOM_NAME';
  // the same as we have at jitsi create room form
  const isValidName = ROOM.match(/^[^?&:"'%#]+$/);

  before(() => {
    if (isValidName) {
      cy.visit(`/league/${ROOM}`);
    } else {
      throw new Error('const ROOM is not not valid');
    }
  });

  it('set the correct iframe path by Vue route', () => {
    cy.get('#jitsiConferenceFrame0')
      .should('exist')
      .should('have.attr', 'src')
      .should('contains', ROOM);
  });
});
