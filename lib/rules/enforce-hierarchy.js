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
        const {resolveFullPath, resolve, resolveFromFullPath, stripCwd, findCategory} = createUtils(context.getCwd(), context.settings.htg);

        const options = context.options[0];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const resolvedOptions = Object.keys(options).reduce((previousValue, currentValue) => {
            previousValue[resolveFullPath(currentValue)] = options[currentValue].map(value => resolveFullPath(value));
            return previousValue;
        }, {});

        const isDependencyAllowed = (source, target) => resolvedOptions[source].find(value => target.startsWith(value));

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ImportDeclaration: (node) => {
                const contextFileName = context.getFilename();

                const target = resolve(node.source.value, contextFileName);
                const source = resolveFromFullPath(contextFileName);

                const targetCategory = findCategory(target);
                if (!targetCategory) return;

                const sourceCategory = findCategory(source);
                if (!sourceCategory) return;

                if (source.wildcard === target.wildcard) {
                    if (targetCategory === sourceCategory) return;

                    if (isDependencyAllowed(sourceCategory, targetCategory)) return;
                }

                context.report({
                    node: node.source,
                    message: `HTG: Importing from forbidden module category: {{ sourceModule }} -> {{ targetModule }}.`,
                    data: {
                        sourceModule: stripCwd(sourceCategory).replace('*', source.wildcard),
                        targetModule: stripCwd(targetCategory).replace('*', target.wildcard)
                    }
                });
            }

        };
    }
};
