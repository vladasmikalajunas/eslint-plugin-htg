"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Prevent imports from modules own index files",
            recommended: false,
        },
        schema: []
    },

    create: function (context) {

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const invalidImports = [
            '.',
            './',
            './index'
        ]

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ImportDeclaration: (node) => {
                if (!node.source) return;

                if (invalidImports.indexOf(node.source.value) === -1) return;
    
                context.report({
                    node: node.source,
                    message: 'HTG: importing from module\'s own index file. Convert to a relative import.',
                });
            }
        };
    }
};
