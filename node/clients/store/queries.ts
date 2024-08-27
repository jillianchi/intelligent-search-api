export const itemsWithSimulation = `
query itemsWithSimulation($items: [ItemInput], $regionId: String, $salesChannel: String) {
  itemsWithSimulation(items: $items, regionId: $regionId, salesChannel: $salesChannel) {
    itemId
    sellers {
			error
      sellerId
      commertialOffer {        
        AvailableQuantity
        Price
        ListPrice
        Tax        
        PriceValidUntil
				PriceWithoutDiscount
        spotPrice
        discountHighlights {
          name
          additionalInfo {
            key
            value
          }
        }
        teasers {
          name
          generalValues {
            key
            value
          }
					conditions{
						minimumQuantity
						parameters {
							name
							value
						}
					}
					effects {
						parameters {
							name
							value
						}
					}
        }
        Installments {
					PaymentSystemName
        	Value
          InterestRate
          TotalValuePlusInterestRate
          NumberOfInstallments
          Name
          PaymentSystemGroupName
      	}
      }
    }
  }
}
`
