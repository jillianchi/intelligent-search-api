export const searchSuggestionsResponseMock = {
  total: 0,
  sampling: false,
  translated: false,
  locale: 'en-US',
  query: 'top',
  operator: 'and',
  suggestion: {
    searches: [
      {
        term: 'top shirt',
        count: 3,
      },
    ],
  },
  correction: {
    misspelled: false,
  },
}
