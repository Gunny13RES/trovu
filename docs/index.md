# [trovu.net](https://trovu.net/) – Web shortcuts, social, private.

Trovu is the successor of [Serchilo](https://github.com/georgjaehnig/serchilo-drupal) / [FindFind.it](https://www.findfind.it/). Read about the [differences](legacy/differences.md).

trovu allows you to define shortcuts for URLs / websites and then quickly access them in a command-line way, e.g.

-   `g berlin` – search Google for "berlin".
-   `w berlin` – Wikipedia article for "berlin" in your language.
-   `gd london, liverpool` – find a route on Google Maps from London to Liverpool.

## Key features

-   **Privacy**: Queries are processed in the client, not server.
-   **Social**: Curated shortcuts are kept in YAML files in a [public Github repository](https://github.com/trovu/trovu-data). Send a pull request to add or edit them.
-   **Freedom**: Optionally, create personal shortcuts in [your own repository](https://github.com/trovu/trovu-data-user).

## Read more

-   [Namespaces](shortcuts/namespaces.md)
-   [How a query is processed](users/processing.md)
-   [Includes](shortcuts/includes.md)
-   [Shortcut URLs](shortcuts/urls.md)
-   [Advanced settings & personal shortcuts](users/advanced.md)
-   [Trovu compared to Serchilo / FindFind.it](legacy/differences.md)
-   [Migrate from FindFind.it](legacy/migrate.md)
-   [Troubleshooting / FAQ](users/troubleshooting.md)
-   [Support](users/support.md)

## Repositories

### [trovu-data](https://github.com/trovu/trovu-data)

This repository contains all the data, e.g.

-   shortcuts
-   types/city
    -   mappings for [argument type _city_](shortcuts/urls.md#city)

Fork this repository to add or edit shortcuts (and send then a pull request).

### [trovu](https://github.com/trovu/trovu)

This (future mono-)repository contains now the web frontend and this documentation.

## Live web version

[https://trovu.net/](https://trovu.net/)