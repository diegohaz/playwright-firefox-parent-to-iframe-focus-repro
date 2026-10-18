# Firefox parent-to-iframe focus reproduction

This project has one plain HTML page, one test, and only `@playwright/test` as a dependency. It does not use Ariakit or another UI library.

## Run

```sh
npm ci
npx playwright install firefox
npm test
npm test -- --headed
```

The test is expected to fail in Playwright Firefox. It clicks the parent document's button. Its handler makes exactly one native DOM focus call:

```js
queueMicrotask(() => button.focus());
```

Expected: the iframe's `#inner` button becomes its document's active element.

Actual: the parent document's active element becomes the iframe, but the iframe document's active element remains `body`. The `toBeFocused()` assertion times out. The test does not call Playwright's `locator.focus()` helper.

## Manual check

Open `index.html` in stock Firefox and click **Focus iframe button**. The inner button should receive the blue focus outline. The same page is used by the automated test.

## Other browser builds

The dependency is pinned to the latest stable release checked on October 18, 2026, Playwright 1.64.1. The failure was reproduced in both headed and headless mode with its bundled Firefox r1555 (157.0), and with Firefox r1562 (157.0), which contains the rollback for #43280.

To use another downloaded Firefox build:

```sh
FIREFOX_EXECUTABLE_PATH=/absolute/path/to/firefox npm test
```

On macOS 27, if Firefox fails to start because it cannot access its shared app-data directory, use the separate startup workaround described in [Playwright #42768](https://github.com/microsoft/playwright/issues/42768):

```sh
mkdir -p /tmp/pw-parent-to-iframe-home
CFFIXED_USER_HOME=/tmp/pw-parent-to-iframe-home npm test
CFFIXED_USER_HOME=/tmp/pw-parent-to-iframe-home npm test -- --headed
```

## Related reports

- [Playwright #43280](https://github.com/microsoft/playwright/issues/43280) concerns the opposite direction, iframe to parent. That regression was fixed by the r1562 rollback; this parent-to-iframe failure remains.
- [Ariakit #7977](https://github.com/ariakit/ariakit/issues/7977) contains the consumer scenario and the controlled focus-emulation investigation.
