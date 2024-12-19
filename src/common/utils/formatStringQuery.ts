export const formatInputQuery = <T>(filterEle: T) => {
  let formattedFilterEle = {}
  if (filterEle['equalTo']) {
    formattedFilterEle = filterEle['equalTo']
  } else if (filterEle['notEqualTo']) {
    formattedFilterEle['$ne'] = filterEle['notEqualTo']
  } else if (filterEle['exists']) {
    formattedFilterEle['$exists'] = filterEle['exists']
  } else if (
    filterEle['greaterThan'] ||
    filterEle['greaterThanEqual'] ||
    filterEle['lessThan'] ||
    filterEle['lessThanEqual']
  ) {
    if (filterEle['greaterThan']) {
      formattedFilterEle['$gt'] = filterEle['greaterThan']
    } else if (filterEle['greaterThanEqual']) {
      formattedFilterEle['$gte'] = filterEle['greaterThanEqual']
    }

    if (filterEle['lessThan']) {
      formattedFilterEle['$lt'] = filterEle['lessThan']
    } else if (filterEle['lessThanEqual']) {
      formattedFilterEle['$lte'] = filterEle['lessThanEqual']
    }
  }

  return formattedFilterEle
}
