export const simulationResponseMock = {
  ratesAndBenefitsData: {
    rateAndBenefitsIdentifiers: [],
    teaser: [
      {
        featured: true,
        id: '40275ef0-cd2a-4eb5-b1cd-1944ca14b5dd',
        name: '8% Boleto',
        conditions: {
          parameters: [
            {
              name: 'PaymentMethodId',
              value: '6',
            },
          ],
          minimumQuantity: 0,
        },
        effects: {
          parameters: [
            {
              name: 'PercentualDiscount',
              value: '8.0',
            },
          ],
        },
        teaserType: 'Profiler',
      },
    ],
  },
}

export const regionsMock = [
  {
    id: 'myregionid',
    sellers: [
      {
        id: 'myprivateseller',
        name: 'My Private Seller',
        logo: null,
      },
    ],
  },
]
