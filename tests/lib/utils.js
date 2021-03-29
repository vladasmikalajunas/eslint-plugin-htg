const {createUtils} = require("../../lib/utils");

const parserOptions = {
    ecmaVersion: 2015,
    sourceType: 'module'
};

const createTest = (settings) => {
    const utils = createUtils(process.cwd(), settings.htg);

    return (t) => Object.assign(
        {settings, parserOptions},
        t,
        {filename: utils.resolve(t.filename)}
    );
}

module.exports = {
    createTest
};
