const path = require('path');

/*
Glossary

importPath - the path listed in "import" statements, e.g. "./src/file.js", "@modules/xyz/test.js"
path - full path to file, e.g. "/root/src/modules/apps/demo/index.js"
virtualPath - virtual path, might contain wildcards, e.g. "/root/src/modules/apps/*\/index.js"
categories - virtual paths to category directories
 */


const createUtils = (cwd, settings) => {
    const aliases = Object.keys(settings.path);

    /**
     * Resolves import path to full path
     * @param importPath {string} E.g. "@modules/xyz/index.js"
     * @returns {string} E.g. "/root/src/modules/xyz/index.js"
     */
    const resolve = (importPath) => {
        var alias = aliases.find(value => importPath.startsWith(value));

        if (alias) {
            importPath = importPath.replace(alias, settings.path[alias])
        }

        return path.resolve([cwd, importPath].join('/'));
    }

    const resolve2 = (importPath) => {
        const realPath = resolve(importPath);
        return {
            importPath,
            realPath,
            path: pathToVirtual(realPath)
        }
    }

    const resolveFromFullPath = (realPath) => {
        return {
            realPath,
            path: pathToVirtual(realPath)
        }
    }

    const categories = settings.modules.map(value => resolve(value));

    /**
     * Resolves full path to virtual path
     * @param path {string} E.g. "/root/src/modules/apps/demo/index.js"
     * @returns {string} E.g. "/root/src/modules/apps/*\/index.js"
     */
    const pathToVirtual = (path) => {
        for (let c = 0;  c < categories.length; c++) {
            const category = categories[c];

            const categoryParts = category.split('*');

            let tempPath = path;
            for (let i = 0; i < categoryParts.length; i++) {
                const categoryPart = categoryParts[i];
                if (tempPath.startsWith(categoryPart)) {
                    const restOfPath = tempPath.replace(categoryPart, '').split('/');
                    restOfPath.shift();
                    tempPath = '/' + restOfPath.join('/');

                    if (i === categoryParts.length - 1) {
                        return category + tempPath;
                    }
                }
            }
        }

        return path;
    }

    const stripCwd = (path) => path.replace(cwd, '');

    const findCategory = (file) => categories.find(value => file.path.startsWith(value));

    const findModule = (file) => {
        const category = findCategory(file);

        if (!category) return;

        const moduleName = file.path.replace(category, '').split('/')[1];

        return [category, moduleName].join('/');
    };

    return {
        resolve, resolve2, resolveFromFullPath, pathToVirtual, stripCwd, findCategory, findModule,
        getCategories: () => categories
    };
}

const getRelativePath = (from, to) => {
    const prefix = path.relative(path.dirname(from), path.dirname(to)) || '.';
    return (prefix[0] !== '.' ? './' : '') + `${prefix}/${path.basename(to)}`;
}

module.exports = {
    createUtils,
    getRelativePath
}
