const validNavigationPage = (attributePath: string, query?: string) => {
  if (query) {
    return false
  }

  return attributePath.split('/').filter((value) => value).length % 2 === 0
}

export default validNavigationPage
