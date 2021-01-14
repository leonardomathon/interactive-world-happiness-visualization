const colors = require('tailwindcss/colors');

module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            // Build your palette here
            gray: colors.blueGray,
            black: colors.black,
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
