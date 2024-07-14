import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App, { Movie } from '../App';
import { it, describe, beforeEach, expect } from '@jest/globals';

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

describe('App', () => {
  const mockMovies: Movie[] = [
    {
      "id": 1726,
      "title": "Iron Man",
      "overview": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
      "poster_path": "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
      "release_date": "2008-04-30",
      "vote_average": 7.645,
      "vote_count": 25903
    },
    {
      "id": 1724,
      "title": "The Incredible Hulk",
      "overview": "Scientist Bruce Banner scours the planet for an antidote to the unbridled force of rage within him: the Hulk. But when the military masterminds who dream of exploiting his powers force him back to civilization, he finds himself coming face to face with a new, deadly foe.",
      "poster_path": "/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg",
      "release_date": "2008-06-12",
      "vote_average": 6.211,
      "vote_count": 11518
    },
  ];

  beforeEach(() => {
    fetchMock.reset();
  });

  it('renders loading indicator while fetching movies', () => {
    fetchMock.mock('https://apis.themoviedb.org/3/list/5?api_key=d4bc3c640586e7f90dc68d8b300247ff&language=en-US', {
      body: { items: mockMovies },
      status: 200,
    });

    const { getByTestId } = render(<App />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders movie list after fetching movies', async () => {
    fetchMock.mock('https://apis.themoviedb.org/3/list/5?api_key=d4bc3c640586e7f90dc68d8b300247ff&language=en-US', {
      body: { items: mockMovies },
      status: 200,
    });

    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText('Iron Man')).toBeTruthy();
      expect(getByText('The Incredible Hulk')).toBeTruthy();
    });
  });

  it('opens and closes modal with movie details', async () => {
    fetchMock.mock('https://apis.themoviedb.org/3/list/5?api_key=d4bc3c640586e7f90dc68d8b300247ff&language=en-US', {
      body: { items: mockMovies },
      status: 200,
    });

    const { getByText, getByTestId, queryByTestId } = render(<App />);
    await waitFor(() => {
      expect(getByText('Iron Man')).toBeTruthy();
    });

    fireEvent.press(getByText('Iron Man'));
    await waitFor(() => {
      expect(getByText('After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.')).toBeTruthy();
    });

    fireEvent.press(getByTestId('close-button'));
    await waitFor(() => {
      expect(queryByTestId('close-button')).toBeNull();
    });
  });
});