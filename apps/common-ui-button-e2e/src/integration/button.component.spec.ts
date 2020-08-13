describe('common-ui-button', () => {
  beforeEach(() => cy.visit('/iframe.html?id=slbuttoncomponent--primary'));

  it('should render the component', () => {
    cy.get('button[sl-button]').should('exist');
  });
});
