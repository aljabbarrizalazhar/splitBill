import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
    colors: {
      primary: '#ECDFCC',
      secondary: '#3C3D37',
      tersier1: '#697565',
      tersier2: '#E5E1DA',
    },
  },
  plugins: [
    flowbite.plugin(),
  ]
}

