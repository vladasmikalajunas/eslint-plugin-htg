const createUtils = (cwd, settings) => {
    const resolve = (importPath) => {
        const aliases = Object.keys(settings.path);

        var alias = aliases.find(value => importPath.startsWith(value));

        if (alias) {
            importPath = importPath.replace(alias, settings.path[alias])
        }

        return [cwd, importPath].join('/');
    }

    const stripCwd = (path) => path.replace(cwd, '');

    const getCategories = () => settings.modules.map(value => resolve(value));

    const findCategory = (modules, importPath) => modules.find(value => importPath.startsWith(value));

    const findModule = (modules, importPath) => {
        const category = findCategory(modules, importPath);

        if (!category) return;

        const moduleName = importPath.replace(category, '').split('/')[1];

        return [category, moduleName].join('/');
    };

    return {resolve, stripCwd, getCategories, findCategory, findModule};
}

module.exports = {
    createUtils
}
