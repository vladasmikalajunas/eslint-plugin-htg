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
        fixable: "code",
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        const {resolve, findModule, stripCwd} = createUtils(context.getCwd(), context.settings.htg);

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const createValidator = (errorMessage) => (node) => {
            const {source} = node;
            if (!source) return;

            const importPath = resolve(source.value);
            const filePath = context.getFilename();

            const importModule = findModule(importPath);
            if (!importModule) return;

            const fileModule = findModule(filePath);

            if (importModule !== fileModule) return;

            if (importPath[0] === '.') return;

            context.report({
                node: node.source,
                message: errorMessage,
                fix: function(fixer) {
                    if (importPath === fileModule) return; // Importing via module public interface. Need manually to check what thing is being imported and use internal path.
                    return fixer.replaceText(node.source, node.source.raw.replace(node.source.value, `.${importPath.replace(fileModule, '')}`));
                }
            });
            //[print(node), print(node.source)].join(';\n')
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
