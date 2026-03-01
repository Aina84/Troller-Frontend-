/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4F46E5',
                    hover: '#4338CA',
                },
                bg: '#F3F4F6',
                'board-bg': '#E2E8F0',
                card: '#FFFFFF',
            }
        },
    },
    plugins: [],
}
