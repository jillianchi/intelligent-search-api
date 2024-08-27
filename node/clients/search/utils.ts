import { Functions } from '@gocommerce/utils'

export const searchEncodeURI = (account: string) => (str: string) => {
  if (!Functions.isGoCommerceAcc(account)) {
    return str.replace(/[%"'.()]/g, (c: string) => {
      switch (c) {
        case '%':
          return '@perc@'

        case '"':
          return '@quo@'

        case "'":
          return '@squo@'

        case '.':
          return '@dot@'

        case '(':
          return '@lpar@'

        case ')':
          return '@rpar@'

        default: {
          return c
        }
      }
    })
  }

  return str
}
