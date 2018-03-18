import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';

import App from './App';
import appStore from './store';
import actions from './actions';

describe('App Rendering', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App store={appStore}/>, div);
  });
});

describe('Form submission', () => {
  let component;
  let store = appStore;
  let validMagnet = 'magnet:?xt=urn:btih:565DB305A27FFB321FCC7B064AFD7BD73AEDDA2B';

  beforeAll(function() {
    actions.postMagnetURI = jest.fn();
  })

  beforeEach(function() {
    component = mount(<App store={store}/>);
  });

  afterEach(function() {
    component.unmount();
  });

  it('behaves correctly when a valid magnet URI is submitted', function() {
    component.find('input[type="text"]').node.value = validMagnet;
    component.find('input[type="submit"]').get(0).click();

    expect(actions.postMagnetURI).toBeCalled();
  });

  it('displays an error message when an invalid magent URI is submitted', function() {
    component.find('input[type="text"]').node.value = 'INVALID_MAGNET';
    component.find('input[type="submit"]').get(0).click();

    expect(store.status).toBe('Please enter a valid magent URI');
    expect(component.text()).toMatch('Please enter a valid magent URI');
  });
});
