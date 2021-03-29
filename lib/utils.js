const createUtils = (context) => {
    const cwd = context.getCwd();
    const settings = context.settings.htg;

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

    return {resolve, stripCwd, getCategories, findCategory};
}

module.exports = {
    createUtils
}
