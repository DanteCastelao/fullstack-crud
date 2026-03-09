export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: '{{BRAND_COLOR}}',
            },
        },
    },
    plugins: [],
}
