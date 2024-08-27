import { IOClients } from '@vtex/api'

import IntelligentSearch from './intelligent-search'
import { Store } from './store'
import { Checkout } from './checkout'
import { Search } from './search'
import { Rewriter } from './rewriter'
import { GraphQLServer } from './graphql-server'
import { Osiris } from './osiris'

export class Clients extends IOClients {
  public get intelligentSearch() {
    return this.getOrSet('intelligentSearch', IntelligentSearch)
  }

  public get store() {
    return this.getOrSet('store', Store)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get search() {
    return this.getOrSet('search', Search)
  }

  public get rewriter() {
    return this.getOrSet('rewriter', Rewriter)
  }

  public get graphQLServer() {
    return this.getOrSet('graphQLServer', GraphQLServer)
  }

  public get osiris() {
    return this.getOrSet('osiris', Osiris)
  }
}
