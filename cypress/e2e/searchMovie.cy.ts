describe('template spec', () => {
  it('should returns a movie with zombie title', () => {
    cy.visit('http://localhost:5173/');
    cy.get('input').type('zombie');
    cy.get('button').click();
    cy.get('li').its('length').then(len => {
      cy.get('li').eq((len % 4) - 1 > 0 ? (len % 4) - 1 : 0).click();
    });
  });
});