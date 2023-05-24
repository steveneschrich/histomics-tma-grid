const { VueLoaderPlugin } = require("vue-loader");

module.exports = function (config) {
    console.log(config.module);
    config.module.rules.push({
        resource: {
            test: /\.vue$/,
        },
        use: [require.resolve("vue-loader")],
    });

    config.plugins.push(new VueLoaderPlugin());
    return config;
};
