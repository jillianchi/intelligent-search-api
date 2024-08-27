# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.27.0] - 2024-07-09

### Added

- Implements `repeatSponsoredProducts`, an option that allows the search result to control whether or not to repeat sponsored products in the search results;
- Passes `sponsoredProductsCount` to the Ad Server Resolver.

## [0.26.4] - 2024-05-28

### Fixed

- Add `segment`, `tenant` and `variant` middlewares to `sponsoredProduct` query.

## [0.26.3] - 2024-05-09

### Fixed

- Use `originalLabel` to sort field values to respect the field values sorting in the admin for translated stores.

## [0.26.2] - 2024-04-23

## [0.26.1] - 2024-04-23

## [0.26.0] - 2024-04-22

### Added

- Check if the app `vtex.adserver-graphql` is installed before requesting sponsored products. Applies to all accounts.

## [0.25.11] - 2024-04-22

### Fixed
- Error when calling `product` query for an unsupported locale.

## [0.25.10] - 2024-04-22

## [0.25.9] - 2024-04-17

### Fixed
- Use `product` value as ID.

## [0.25.8] - 2024-04-16

### Added
- `trade-policy` when calling search-api to get product by identifier.

## [0.25.7] - 2024-04-02

## [0.25.6] - 2024-04-02

## [0.25.5] - 2024-04-01

## [0.25.4] - 2024-03-28

### Added
- Sales channel and facets from segment to sponsored products query.

## [0.25.3] - 2024-03-21

## [0.25.2] - 2024-03-19

### Fixed

- `items` list for PDP.

## [0.25.1] - 2024-03-18

### Changed
- Normalize `linkText`.

## [0.25.0] - 2024-03-06

### Added

- Sponsored products to productSearch when `showSponsored` flag is `true`.

## [0.24.0] - 2024-03-06

### Added

- Translate product details.

## [0.23.0] - 2024-03-05

### Removed

- SOLR category tree from facets query

## [0.22.0] - 2024-02-28

### Changed

- Mapping search document to VTEX Product.

## [0.21.1] - 2024-02-20

### Added

-  Log for the `ShowCategoryTree` property.

## [0.21.0] - 2024-02-08

### Added

- Bump vtexis-compatibility-layer version and add attributes field to items

## [0.20.0] - 2023-12-08

### Added

- Created query parameter `anonymousId` for `sponsoredProducts` used on A/B testing.

## [0.19.2] - 2023-11-08

### Fixed

- Sorts seller by `defaultSellers` in the sponsored products resolver.

## [0.19.1] - 2023-10-27

## [0.19.0] - 2023-10-24

### Added

- Queries the field `identifier` on `sponsoredProducts` in order to know how to resolver the product with is unique ID.

### Fixed

- Satisfies the new `adserver-graphql` schema by requesting the `advertisement` field directly from the product list.

## [0.18.0] - 2023-09-21

### Fixed
- Updated the adserver-graphql version.

## [0.17.0] - 2023-09-20

### Added

- `advertisement` field in `sponsoredProduct` query.

## [0.16.0] - 2023-09-15

### Fixed
- Whitelisted query strings used for controlling search-api behavior dynamically

## [0.15.0] - 2023-08-22

### Added
- Adserver feature.

## [0.14.1] - 2023-08-21

### Fixed
- Handling possible undefined info when checking for simulation price differences

## [0.14.0] - 2023-08-16

### Added
- Log for simulation price difference.

## [0.13.0] - 2023-08-15

### Added
- `product` route.

## [0.12.0] - 2023-08-03

### Added
- Added `additionalInfo` to the search query.

## [0.11.0] - 2023-06-29

### Added
- `link`, `linkEncoded` and `href` to category tree values.

## [0.10.0] - 2023-06-02

### Added
- Added `generalValues` to the search query.

## [0.9.0] - 2023-05-22

### Fixed
- Region with no sellers should be treated differently than the no region case.

### Removed
- Sorting on `product:` queries, it was moved downstream.

## [0.8.0] - 2023-02-23

### Added
- Shipping route to IS filter header.

## [0.7.3] - 2023-02-14

### Fixed
- Fix duplicated breadcrumb values after change from `productClusterIds` to `productClusterNames`.

## [0.7.2] - 2023-01-13

### Fixed
- Breadcrumb with special characters.

## [0.7.1] - 2023-01-02

### Fixed
- Breadcrumb link for unsorted categories.

## [0.7.0] - 2022-12-22

### Added
- `PaymentSystemGroupName` to simulation call.

## [0.6.8] - 2022-12-20

### Changed

- Update `@vtex/vtexis-compatibility-layer` dependency.

## [0.6.7] - 2022-12-15

- Update `@vtex/vtexis-compatibility-layer` dependency.

## [0.6.6] - 2022-12-15

- Update `@vtex/vtexis-compatibility-layer` dependency.

## [0.6.5] - 2022-12-14

### Changed

- Update `@vtex/vtexis-compatibility-layer` dependency.

## [0.6.4] - 2022-12-12

### Added

- Tax on itemsWithSimulation query return
## [0.6.3] - 2022-10-26

### Fixed
- Fix breadcrumb when the SP API returns the facets in a different language.

## [0.6.2] - 2022-10-10

### Fixed

- Failing tests.

### Added

- Workflow to run tests in node folder on PRs.

## [0.6.1] - 2022-10-10

### Added

- `X-VTEX-IS-TenantLocale` header to requests.

## [0.6.0] - 2022-09-26

### Changed

- Handles errors from other services to continue returning search results.

### Added

- Logs for degraded search results.

## [0.5.1] - 2022-08-15

### Changed

- Upgrades @vtex/vtexis-compatibility-layer dep

## [0.5.0] - 2022-08-15

### Fixed

- Fix breadcrumb order when there are equal attribute values.

### Added

- Forwards `release` field to `releaseDate` field on Product type

## [0.4.1] - 2022-07-21

### Fixed

- Remove `rule` from the unecessary fields.

## [0.4.0] - 2022-07-21

### Added

- Intelligent Search Plugin middleware.

## [0.3.2] - 2022-07-05

### Added

- `regionalizationBehavior` to the `ALLOWED_QUERYSTRINGS`.
- `show-invisible-items`to the white list.

## [0.3.1] - 2022-06-15

### Fixed

- IS client metrics.

## [0.3.0] - 2022-06-08

### Removed

- VBase from `getSellers`.

## [0.2.2] - 2022-05-27

### Fixed

- Add regionId to the `ALLOWED_QUERYSTRINGS`.

## [0.2.1] - 2022-04-20

### Added

- `facetKey` to the Facet object.

## [0.2.0] - 2022-04-18

### Added

- pagination to `productSearch` API.

## [0.1.12] - 2022-03-29

### Added

- Add `v` to the query string white list.

## [0.1.11] - 2022-03-22

### Fixed

- Add `letorWindowSize` to the query string white list.

## [0.1.10] - 2022-02-22

### Fixed

- `salesChannel` when receiving it as empty string from query.

## [0.1.9] - 2022-02-18 [YANKED]

### Fixed

- Use `regionId` and `salesChannel` from query in `productSearch`.

## [0.1.8] - 2022-02-03

## [0.1.7] - 2022-02-03

### Fixed

- Banners for searches with empty query.

## [0.1.6] - 2022-01-31

### Fixed

- Decode query before calling Search API.

## [0.1.5] - 2022-01-27

### Fixed

- Add `categoriesIds` to the allowed fields.

## [0.1.4] - 2022-01-27

### Fixed

- Bug where the regionId and the `trade-policy` were not being passed to the `itemsWithSimulation` call.

## [0.1.3] - 2022-01-25

## [0.1.2] - 2022-01-24

### Removed

- `getBenefits` call.

## [0.1.1] - 2022-01-19

### Changed

- Increase number of replicas

## [0.1.0] - 2022-01-18

### Added

- Intelligent Search API
