"use strict";

const {createUtils} = require('../utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Dependencies must adhere to the module hierarchy",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            {
                type: 'object',
                patternProperties: {
                    '^.*$': {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                },
                additionalProperties: false,
            },
        ]
    },

    create: function (context) {
        const {resolve, stripCwd, findCategory} = createUtils(context.getCwd(), context.settings.htg);

        const options = context.options[0];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const resolvedOptions = Object.keys(options).reduce((previousValue, currentValue) => {
            previousValue[resolve(currentValue)] = options[currentValue].map(value => resolve(value));
            return previousValue;
        }, {});

        const isDependencyAllowed = (source, target) => resolvedOptions[source].find(value => target.startsWith(value));

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ImportDeclaration: (node) => {
                const {source} = node;
                const importPath = resolve(source.value);
                const filePath = context.getFilename();

                const importCategory = findCategory(importPath);
                if (!importCategory) return;

                const fileCategory = findCategory(filePath);
                if (!fileCategory) return;

                if (importCategory === fileCategory) return;

                const isAllowed = isDependencyAllowed(fileCategory, importCategory);
                if (isAllowed) return;

                context.report({
                    node: node.source,
                    message: `HTG: Importing from forbidden module category: {{ sourceModule }} -> {{ targetModule }}.`,
                    data: {
                        sourceModule: stripCwd(fileCategory),
                        targetModule: stripCwd(importCategory)
                    }
                });
            }

        };
    }
};
