describe('common-ui-action-tracker', () => {
  beforeEach(() => cy.visit('/iframe.html?id=slactiontrackercomponent--primary&knob-options&knob-style.width.px&knob-circleStrokeWidth&knob-stroke&knob-strokeSuccess&knob-checkmarkStrokeWidth'));

  it('should render the component', () => {
    cy.get('sl-action-tracker').should('exist');
  });
});
