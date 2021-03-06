import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();

      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, entries);

      const expectedState = Map({
        entries: List.of('Trainspotting', '28 Days Later')
      });

      expect(nextState).to.equal(expectedState);
    });

    it('converts to immutable', () => {
      const state = Map();

      // note: entries is a plain JS array, not an Immutable list
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);

      const expectedState = Map({
        entries: List.of('Trainspotting', '28 Days Later')
      });
      
      expect(nextState).to.equal(expectedState);
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });

      const nextState = next(state);

      const expectedState = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      });
      
      expect(nextState).to.equal(expectedState);
    
    });

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });

      const nextState = next(state);

      const expectedState = Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      });

      expect(nextState).to.equal(expectedState);

    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });

      const nextState = next(state);

      const expectedState = Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
      });

      expect(nextState).to.equal(expectedState);

    });

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });

      const nextState = next(state);

      const expectedState = Map({
        winner: 'Trainspotting'
      });

      expect(nextState).to.equal(expectedState);

    });

  });

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      });

      const nextState = vote(state, 'Trainspotting');

      const expectedState = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        })
      });

      expect(nextState).to.equal(expectedState);
    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        })
      });

      const nextState = vote(state, 'Trainspotting');

      const expectedState = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        })
      });

      expect(nextState).to.equal(expectedState);

    });

  });

});