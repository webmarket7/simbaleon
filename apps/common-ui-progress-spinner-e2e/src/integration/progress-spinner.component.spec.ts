describe('common-ui-progress-spinner', () => {
  beforeEach(() => cy.visit('/iframe.html?id=slprogressspinnercomponent--primary&knob-options&knob-diameter&knob-mode&knob-strokeWidth&knob-stroke&knob-indeterminateTiming&knob-determinateTiming&knob-value&knob-playOnInit'));

  it('should render the component', () => {
    cy.get('sl-progress-spinner').should('exist');
  });
});
