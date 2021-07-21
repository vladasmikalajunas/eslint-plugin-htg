# Disallow global paths for internal module dependancies (no-global-internal-imports)

This rule prevents importing local module level dependencies via global module path. Relative imports should be used instead.


## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
// file path: modules/myModule/file.js
import { Something } from 'modules/myModule/internal.js';

```

Examples of **correct** code for this rule:

```js
// file path: modules/myModule/file.js
import { Something } from './internal.js';

```
