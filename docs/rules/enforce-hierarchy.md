# Dependencies must adhere to the module hierarchy (enforce-hierarchy)

This rule enforces module hierarchy.


## Rule Details

With the rule options defined below, here are the examples:

Examples of **incorrect** code for this rule:

```js

// File: @modules/commons/my-module
import { Something } from '@modules/features/other-module';

```

Examples of **correct** code for this rule:

```js

// File: @modules/pages/my-module
import { Something } from '@modules/commons/other-module';

```

### Options

Define an object describing allowed hierarchy.

Object keys are a module categories. Values are arrays of allowed module categories for import.

```json
{
    "@modules/commons": ["@modules/commons"],
    "@modules/models": ["@modules/models","@modules/commons"],
    "@modules/components": ["@modules/components","@modules/commons"],
    "@modules/features": ["@modules/features", "@modules/models", "@modules/components","@modules/commons"],
    "@modules/pages": ["@modules/pages", "@modules/features", "@modules/models", "@modules/components","@modules/commons"]
}
```
