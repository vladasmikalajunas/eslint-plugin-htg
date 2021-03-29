# Disallow deep module imports (no-deep-module-imports)

This rule prevents reaching into internals of a module. Module must be used via it's public API.


## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

import { Something } from 'modules/myModule/internal.js';

```

Examples of **correct** code for this rule:

```js

import { Something } from 'modules/myModule';

```

### Options

If there are any options, describe them here. Otherwise, delete this section.
