export const itemsWithSimulationResponseMock = {
  data: {
    itemsWithSimulation: [
      {
        itemId: '3',
        sellers: [
          {
            sellerId: '1',
            commertialOffer: {
              spotPrice: 375.77,
              AvailableQuantity: 10000,
              Price: 375.77,
              ListPrice: 600.3,
              PriceValidUntil: '2023-01-11T18:40:14Z',
              PriceWithoutDiscount: 375.77,
              discountHighlights: [],
              teasers: [
                {
                  name: '8% Boleto',
                  conditions: {
                    minimumQuantity: 0,
                    parameters: [
                      {
                        name: 'PaymentMethodId',
                        value: '6',
                      },
                    ],
                  },
                  effects: {
                    parameters: [
                      {
                        name: 'PercentualDiscount',
                        value: '8.0',
                      },
                    ],
                  },
                },
              ],
              Installments: [
                {
                  PaymentSystemName: 'American Express',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'American Express à vista',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Visa à vista',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 187.88,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 2,
                  Name: 'Visa 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 125.25,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 3,
                  Name: 'Visa 3 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 93.94,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 4,
                  Name: 'Visa 4 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 75.15,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 5,
                  Name: 'Visa 5 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 62.62,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 6,
                  Name: 'Visa 6 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Diners à vista',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 190.7,
                  InterestRate: 100,
                  TotalValuePlusInterestRate: 381.4,
                  NumberOfInstallments: 2,
                  Name: 'Diners 2 vezes com juros',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 130.3,
                  InterestRate: 200,
                  TotalValuePlusInterestRate: 390.9,
                  NumberOfInstallments: 3,
                  Name: 'Diners 3 vezes com juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Mastercard à vista',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 187.88,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 2,
                  Name: 'Mastercard 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 125.25,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 3,
                  Name: 'Mastercard 3 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 93.94,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 4,
                  Name: 'Mastercard 4 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 75.15,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 5,
                  Name: 'Mastercard 5 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 62.62,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 6,
                  Name: 'Mastercard 6 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Boleto Bancário',
                  PaymentSystemGroupName: 'bankInvoicePaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Boleto Bancário à vista',
                },
                {
                  PaymentSystemName: 'Vale',
                  PaymentSystemGroupName: 'giftCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Vale à vista',
                },
                {
                  PaymentSystemName: 'Promissory',
                  PaymentSystemGroupName: 'promissoryPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Promissory à vista',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Customer Credit à vista',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 187.88,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 2,
                  Name: 'Customer Credit 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 129.01,
                  InterestRate: 100,
                  TotalValuePlusInterestRate: 387.03,
                  NumberOfInstallments: 3,
                  Name: 'Customer Credit 3 vezes com juros',
                },
                {
                  PaymentSystemName: 'Free',
                  PaymentSystemGroupName: 'custom201PaymentGroupPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Free à vista',
                },
              ],
            },
          },
          {
            sellerId: 'thirdpartyseller',
            commertialOffer: {
              spotPrice: 375.77,
              AvailableQuantity: 10000,
              Price: 375.77,
              ListPrice: 600.3,
              PriceValidUntil: '2023-01-11T18:40:14Z',
              PriceWithoutDiscount: 375.77,
              discountHighlights: [],
              teasers: [
                {
                  name: '8% Boleto',
                  conditions: {
                    minimumQuantity: 0,
                    parameters: [
                      {
                        name: 'PaymentMethodId',
                        value: '6',
                      },
                    ],
                  },
                  effects: {
                    parameters: [
                      {
                        name: 'PercentualDiscount',
                        value: '8.0',
                      },
                    ],
                  },
                },
              ],
              Installments: [
                {
                  PaymentSystemName: 'American Express',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'American Express à vista',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Visa à vista',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 187.88,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 2,
                  Name: 'Visa 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 125.25,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 3,
                  Name: 'Visa 3 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 93.94,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 4,
                  Name: 'Visa 4 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 75.15,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 5,
                  Name: 'Visa 5 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 62.62,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 6,
                  Name: 'Visa 6 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Diners à vista',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 190.7,
                  InterestRate: 100,
                  TotalValuePlusInterestRate: 381.4,
                  NumberOfInstallments: 2,
                  Name: 'Diners 2 vezes com juros',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 130.3,
                  InterestRate: 200,
                  TotalValuePlusInterestRate: 390.9,
                  NumberOfInstallments: 3,
                  Name: 'Diners 3 vezes com juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Mastercard à vista',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 187.88,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 2,
                  Name: 'Mastercard 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 125.25,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 3,
                  Name: 'Mastercard 3 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 93.94,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 4,
                  Name: 'Mastercard 4 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 75.15,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 5,
                  Name: 'Mastercard 5 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 62.62,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 6,
                  Name: 'Mastercard 6 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Boleto Bancário',
                  PaymentSystemGroupName: 'bankInvoicePaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Boleto Bancário à vista',
                },
                {
                  PaymentSystemName: 'Vale',
                  PaymentSystemGroupName: 'giftCardPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Vale à vista',
                },
                {
                  PaymentSystemName: 'Promissory',
                  PaymentSystemGroupName: 'promissoryPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Promissory à vista',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Customer Credit à vista',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 187.88,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 2,
                  Name: 'Customer Credit 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 129.01,
                  InterestRate: 100,
                  TotalValuePlusInterestRate: 387.03,
                  NumberOfInstallments: 3,
                  Name: 'Customer Credit 3 vezes com juros',
                },
                {
                  PaymentSystemName: 'Free',
                  PaymentSystemGroupName: 'custom201PaymentGroupPaymentGroup',
                  Value: 375.77,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 375.77,
                  NumberOfInstallments: 1,
                  Name: 'Free à vista',
                },
              ],
            },
          },
        ],
      },
      {
        itemId: '4',
        sellers: [
          {
            sellerId: '1',
            commertialOffer: {
              spotPrice: 600.3,
              AvailableQuantity: 10000,
              Price: 600.3,
              ListPrice: 1000.5,
              PriceValidUntil: '2023-01-11T18:45:20Z',
              PriceWithoutDiscount: 600.3,
              discountHighlights: [],
              teasers: [
                {
                  name: '8% Boleto',
                  conditions: {
                    minimumQuantity: 0,
                    parameters: [
                      {
                        name: 'PaymentMethodId',
                        value: '6',
                      },
                    ],
                  },
                  effects: {
                    parameters: [
                      {
                        name: 'PercentualDiscount',
                        value: '8.0',
                      },
                    ],
                  },
                },
              ],
              Installments: [
                {
                  PaymentSystemName: 'American Express',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'American Express à vista',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Visa à vista',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 300.15,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 2,
                  Name: 'Visa 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 200.1,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 3,
                  Name: 'Visa 3 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 150.07,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 4,
                  Name: 'Visa 4 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 120.06,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 5,
                  Name: 'Visa 5 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Visa',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 100.05,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 6,
                  Name: 'Visa 6 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Diners à vista',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 304.65,
                  InterestRate: 100,
                  TotalValuePlusInterestRate: 609.3,
                  NumberOfInstallments: 2,
                  Name: 'Diners 2 vezes com juros',
                },
                {
                  PaymentSystemName: 'Diners',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 208.15,
                  InterestRate: 200,
                  TotalValuePlusInterestRate: 624.45,
                  NumberOfInstallments: 3,
                  Name: 'Diners 3 vezes com juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Mastercard à vista',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 300.15,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 2,
                  Name: 'Mastercard 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 200.1,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 3,
                  Name: 'Mastercard 3 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 150.07,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 4,
                  Name: 'Mastercard 4 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 120.06,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 5,
                  Name: 'Mastercard 5 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Mastercard',
                  PaymentSystemGroupName: 'creditCardPaymentGroup',
                  Value: 100.05,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 6,
                  Name: 'Mastercard 6 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Boleto Bancário',
                  PaymentSystemGroupName: 'bankInvoicePaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Boleto Bancário à vista',
                },
                {
                  PaymentSystemName: 'Vale',
                  PaymentSystemGroupName: 'giftCardPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Vale à vista',
                },
                {
                  PaymentSystemName: 'Promissory',
                  PaymentSystemGroupName: 'promissoryPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Promissory à vista',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Customer Credit à vista',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 300.15,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 2,
                  Name: 'Customer Credit 2 vezes sem juros',
                },
                {
                  PaymentSystemName: 'Customer Credit',
                  PaymentSystemGroupName: 'creditControlPaymentGroup',
                  Value: 206.1,
                  InterestRate: 100,
                  TotalValuePlusInterestRate: 618.3,
                  NumberOfInstallments: 3,
                  Name: 'Customer Credit 3 vezes com juros',
                },
                {
                  PaymentSystemName: 'Free',
                  PaymentSystemGroupName: 'custom201PaymentGroupPaymentGroup',
                  Value: 600.3,
                  InterestRate: 0,
                  TotalValuePlusInterestRate: 600.3,
                  NumberOfInstallments: 1,
                  Name: 'Free à vista',
                },
              ],
            },
          },
        ],
      },
    ],
  },
}
