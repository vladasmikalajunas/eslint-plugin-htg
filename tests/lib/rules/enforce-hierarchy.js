"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/enforce-hierarchy"),
    RuleTester = require("eslint").RuleTester;
const {createTest} = require("../../_utils");

const settings = {
    htg: {
        path: {
            '@modules/': 'src/modules/'
        },
        modules: [
            '@modules/commons',
            '@modules/models',
            '@modules/components',
            '@modules/features',
            '@modules/pages',
            '@modules/apps',
            '@modules/apps/*/features',
            '@modules/apps/*/models',
        ]
    }
};

const options = [{
    '@modules/commons': ['@modules/commons'],
    '@modules/models': ['@modules/models', '@modules/commons'],
    '@modules/components': ['@modules/components', '@modules/commons'],
    '@modules/features': ['@modules/features', '@modules/models', '@modules/components', '@modules/commons'],
    '@modules/pages': ['@modules/pages', '@modules/features', '@modules/models', '@modules/components', '@modules/commons'],
    '@modules/apps/*/models': ['@modules/apps/*/models', '@modules/models', '@modules/commons'],
    '@modules/apps/*/features': ['@modules/apps/*/features', '@modules/apps/*/models', '@modules/features', '@modules/models', '@modules/components', '@modules/commons'],
}];

const test = createTest(settings);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("enforce-hierarchy", rule, {

    valid: [
        test({ // Import from the same category
            code: "import { fn } from '@modules/features/myFeature1'",
            filename: "@modules/features/myFeature2/Component.tsx",
            options,
        }),
        test({ // Import from non-module to module
            code: "import { fn } from 'src/custom/folder/file'",
            filename: "@modules/features/myFeature2/Component.tsx",
            options,
        }),
        test({ // Import from module to non-module
            code: "import { fn } from '@modules/features/myFeature1'",
            filename: "src/custom/folder/file.ts",
            options,
        }),
        test({ // Import from non-module to non-module
            code: "import { fn } from 'src/another/custom/folder/file'",
            filename: "src/custom/folder/file.ts",
            options,
        })
    ],

    invalid: [
        test({ // Import from forbidden category
            code: "import { fn } from '@modules/pages/myPage'",
            filename: "@modules/features/unitCard/DesktopComponent.tsx",
            options,
            errors: [{
                message: "HTG: Importing from forbidden module category: /src/modules/features -> /src/modules/pages.",
                type: "Literal"
            }]
        }),
        test({ // Import from forbidden wildcard category
            code: "import { fn } from '@modules/pages/myPage'",
            filename: "@modules/apps/demo/features/unitCard/DesktopComponent.tsx",
            options,
            errors: [{
                message: "HTG: Importing from forbidden module category: /src/modules/apps/*/features -> /src/modules/pages.",
                type: "Literal"
            }]
        })
    ]
});
