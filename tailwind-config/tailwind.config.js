/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@repo/ui/src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      DanjoBoldRegular: ["DanjoBoldRegular"],
      WavvePADORegular: ["WavvePADORegular"],
      SF_HambakSnow: ["SF_HambakSnow"],
      MangoDdobak_B: ["MangoDdobak_B"],
      PretendardRegular: ["PretendardRegular"],
      Neon: ["neon"],
    },
  },
  plugins: [],
};
