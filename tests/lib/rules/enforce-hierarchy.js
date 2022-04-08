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
            '@modules/libs',
            '@modules/features',
            '@modules/apps/*/libs',
            '@modules/apps/*/features',
        ]
    }
};

const options = [{
    '@modules/libs': ['@modules/libs'],
    '@modules/features': ['@modules/libs', '@modules/features'],
    '@modules/apps/*/libs': ['@modules/apps/*/libs', '@modules/libs'],
    '@modules/apps/*/features': ['@modules/apps/*/libs', '@modules/apps/*/features', '@modules/libs', '@modules/features'],
}];

const test = createTest(settings);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("enforce-hierarchy", rule, {

    valid: [
        test({ // Import from the same category
            code: "import { fn } from '@modules/libs/myFeature1'",
            filename: "@modules/features/myFeature2/Component.tsx",
            options,
        }),
        test({ // Import from non-module to module
            code: "import { fn } from 'src/custom/folder/file'",
            filename: "@modules/libs/myFeature2/Component.tsx",
            options,
        }),
        test({ // Import from global to wildcarded module
            code: "import { fn } from '@modules/libs/myFeature1'",
            filename: "@modules/apps/app1/libs/Component.tsx",
            options,
        }),
        test({ // Import from module to non-module
            code: "import { fn } from '@modules/libs/myFeature1'",
            filename: "src/custom/folder/file.ts",
            options,
        }),
        test({ // Import from non-module to non-module
            code: "import { fn } from 'src/another/custom/folder/file'",
            filename: "src/custom/folder/file.ts",
            options,
        }),
        test({ // Import from the same wildcard path
            code: "import { fn } from '@modules/apps/app1/features/feature2'",
            filename: "@modules/apps/app1/features/feature1/MyFeature.tsx",
            options,
        }),
        test({ // Import from the same wildcard path but different categories
            code: "import { fn } from '@modules/apps/app1/libs/feature2'",
            filename: "@modules/apps/app1/features/feature1/MyFeature.tsx",
            options,
        }),
        test({ // Import from allowed wildcard path
            code: "import { fn } from '@modules/apps/app1/features/app1Feature'",
            filename: "@modules/apps/app2/features/app2Feature/MyFeature.tsx",
            options: [options[0], {
                allowedWildcardPaths: {
                    '@modules/apps/app2': ['@modules/apps/app1']
                }
            }],
        })
    ],

    invalid: [
        test({ // Import from forbidden category
            code: "import { fn } from '@modules/features/myPage'",
            filename: "@modules/libs/unitCard/DesktopComponent.tsx",
            options,
            errors: [{
                message: "HTG: Importing from forbidden module category: /src/modules/libs -> /src/modules/features.",
                type: "Literal"
            }]
        }),
        test({ // Import from forbidden wildcard category
            code: "import { fn } from '@modules/features/myPage'",
            filename: "@modules/apps/demo/libs/unitCard/DesktopComponent.tsx",
            options,
            errors: [{
                message: "HTG: Importing from forbidden module category: /src/modules/apps/demo/libs -> /src/modules/features.",
                type: "Literal"
            }]
        }),
        test({ // Import from different wildcard categories
            code: "import { fn } from '@modules/apps/app1/features/app1Feature'",
            filename: "@modules/apps/app2/features/app2Feature/MyFeature.tsx",
            options,
            errors: [{
                message: "HTG: Importing from forbidden module category: /src/modules/apps/app2/features -> /src/modules/apps/app1/features.",
                type: "Literal"
            }]
        })
    ]
});
