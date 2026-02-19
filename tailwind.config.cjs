/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sol: {
                    DEFAULT: '#FCD34D', // Amber 300
                    light: '#FDE68A',   // Amber 200
                },
                cielo: {
                    DEFAULT: '#7DD3FC', // Sky 300
                    light: '#BAE6FD',   // Sky 200
                },
                menta: {
                    DEFAULT: '#86EFAC', // Green 300
                    light: '#BBF7D0',   // Green 200
                },
                suave: {
                    DEFAULT: '#FDBA74', // Orange 300
                    light: '#FED7AA',   // Orange 200
                },
                crema: '#FFFBEB',     // Amber 50
            },
            fontFamily: {
                sans: ['Quicksand', 'Nunito', 'sans-serif'],
                hand: ['Fredoka', 'cursive'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
