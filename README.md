# Roam to LaTeX exporter

![GitHub package.json version](https://img.shields.io/github/package-json/v/alixlahuec/latex-roam?style=flat-square)
[![codecov](https://codecov.io/gh/alixlahuec/latex-roam/branch/main/graph/badge.svg?token=L3HA2JTAKR)](https://codecov.io/gh/alixlahuec/latex-roam)
![File size in bytes for extension.js](https://img.shields.io/github/size/alixlahuec/latex-roam/extension.js?label=size%20%28minified%29&style=flat-square)
![GitHub](https://img.shields.io/github/license/alixlahuec/latex-roam)
![Maintenance](https://img.shields.io/maintenance/yes/2022?style=flat-square)

This plugin is written to enable easy, clean exports from Roam to LaTeX. It aims to fully support all of Roam's markup, while augmenting it with special syntax and capabilities such as:
- referencing tables, figures, and equations in-text
- extracting citekeys, following the pattern `[[@citekey]]`
- (optional) generating a bibliography, if zoteroRoam is also installed

## Getting Started

When the extension is active, you can:
- export a full page, by navigating to that page and clicking the "LaTeX" button that appears under the title
- export a specific block (with all its descendants), by opening the block's menu > `Plugins` > `Export to LaTeX`

Both will open an export dialog, where you will be able to configure settings and generate files.

## Questions & Issues

To learn more about how the plugin parses Roam content into LaTeX, browse [the wiki documentation](https://github.com/alixlahuec/latex-roam/wiki).

If you run into any issues, or have feedback to help improve the plugin, [create an issue on GitHub](https://github.com/alixlahuec/latex-roam/issues), post in the LaTeX channel of the Academia Roamana Discord, or reach out directly on [Twitter @AlixLahuec](https://twitter.com/AlixLahuec).

## Overleaf integration

The plugin offers a one-click export to [Overleaf](https://www.overleaf.com), a free online collaborative LaTeX editor.
Note that any figures or bibliography files will then have to be uploaded to Overleaf separately, as this currently cannot be done automatically via [the API](https://www.overleaf.com/devs).

## zoteroRoam integration

If the plugin detects a compatible version of zoteroRoam in your Roam graph, it will connect to it and generate a `.bib` file if any citekeys are present in the page or block you're exporting.