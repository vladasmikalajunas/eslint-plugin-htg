"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const path = require('path');

function testFilePath(relativePath) {
    return path.join(process.cwd(), './tests/files', relativePath)
}

var rule = require("../../../lib/rules/no-deep-module-imports"),
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
        ]
    }
};

const test = createTest(settings);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-deep-module-imports", rule, {

    valid: [
        test({ // Import from public exports
            code: "import { fn } from '@modules/libs/module'",
            filename: "@modules/libs/anotherModule/MyFile.js",
        }),
        test({ // Deep import from the same module
            code: "import { fn } from '@modules/libs/sameModule/MyAnotherFile'",
            filename: "@modules/libs/sameModule/MyFile.js"
        }),
        test({ // Deep import from module into non-module
            code: "import { fn } from 'src/my/custom/very/very/deep/MyAnotherFile'",
            filename: "@modules/libs/sameModule/MyFile.js"
        }),
        test({ // Import from non-module into module
            code: "import { fn } from '@modules/libs/myModule'",
            filename: "src/my/custom/very/very/deep/MyAnotherFile.js"
        }),
        test({ // Import from non-module into non-module
            code: "import { fn } from 'src/another/folder/file'",
            filename: "src/my/custom/very/very/deep/MyAnotherFile.js"
        }),
    ],

    invalid: [
        test({ // Deep import from another module
            code: "import { fn } from '@modules/libs/myModule/InternalFile'",
            filename: "@modules/libs/anotherModule/MyFile.js",
            errors: [{
                message: "HTG: Reaching deep into the module. Use modules public interface.",
                type: "Literal"
            }]
        }),
        test({ // Deep import from non-module into module
            code: "import { fn } from '@modules/libs/sameModule/MyFile'",
            filename: "src/my/custom/very/very/deep/MyAnotherFile.js",
            errors: [{
                message: "HTG: Reaching deep into the module. Use modules public interface.",
                type: "Literal"
            }]
        }),
    ]
});
