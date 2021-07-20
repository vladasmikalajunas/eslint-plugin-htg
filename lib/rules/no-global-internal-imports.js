"use strict";

const {createUtils} = require('../utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Enforce relative paths for local module files",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        const {resolve, getCategories, findModule, stripCwd} = createUtils(context.getCwd(), context.settings.htg);

        const categories = getCategories();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isReachingIntoModule = (importPath, module) => importPath.replace(module, '').split('/').length > 1;

        const createValidator = (errorMessage) => (node) => {
            const {source} = node;
            if (!source) return;

            const importPath = resolve(source.value);
            const filePath = context.getFilename();

            const importModule = findModule(categories, importPath);
            if (!importModule) return;

            const fileModule = findModule(categories, filePath);

            if (importModule !== fileModule) return;

            if (importPath[0] === '.') return;

            context.report({
                node: node,
                message: errorMessage,
            });
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration: createValidator(`HTG: Importing local dependency via global path.`),
            ExportNamedDeclaration: createValidator(`HTG: Exporting local dependency via global path.`),
        };
    }
};
