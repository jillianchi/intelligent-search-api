const AD_SERVER_GRAPHQL_APP = 'vtex.adserver-graphql'

const isAdServerAppInstalled = async (ctx: Context) => {
  const {
    clients: { apps },
  } = ctx

  const dependencies = await apps.getDependencies()
  const allApps = Object.keys(dependencies)
  const adServerApp = allApps.find((key) => key.includes(AD_SERVER_GRAPHQL_APP))

  return !!adServerApp
}

export default isAdServerAppInstalled
