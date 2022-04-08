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
            {
                type: 'object',
                patternProperties: {
                    allowedWildcardPaths: {
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
                    }
                },
                additionalProperties: false,
            },
        ]
    },

    create: function (context) {
        const {resolveFullPath, resolve, resolveFromFullPath, stripCwd, findCategory} = createUtils(context.getCwd(), context.settings.htg);

        const options = context.options[0];
        const { allowedWildcardPaths = {} } = context.options[1] || {};

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const resolveMapping = (mapping) => Object.keys(mapping).reduce((previousValue, currentValue) => {
            previousValue[resolveFullPath(currentValue)] = mapping[currentValue].map(value => resolveFullPath(value));
            return previousValue;
        }, {});

        const resolvedOptions = resolveMapping(options);
        const resolvedAllowedWildcardPaths = resolveMapping(allowedWildcardPaths);

        const isDependencyAllowed = (source, target) => resolvedOptions[source].find(value => target.startsWith(value));

        const isWildcardDependencyAllowed = (source, target) => {
            const sourcePaths = Object.keys(resolvedAllowedWildcardPaths);

            for (const sourcePath of sourcePaths) {
                if (!source.startsWith(sourcePath)) continue;

                const targetPaths = resolvedAllowedWildcardPaths[sourcePath];

                for (const targetPath of targetPaths) {
                    if (target.startsWith(targetPath)) return true;
                }
            }
            return false;
        };

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

                if (isDependencyAllowed(sourceCategory, targetCategory)) {
                    if (!target.wildcard) return;
                    if (source.wildcardPrefix === target.wildcardPrefix && source.wildcard === target.wildcard) return;
                    if (isWildcardDependencyAllowed(source.realPath, target.realPath)) return;
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
