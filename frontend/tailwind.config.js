/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "black1": "#0C0C0D",
        "grey1": "#717171",
        "grey2": "#7C7C7C",
        "grey3": "#484848",
        "grey4": "#343434",
        "green1": "#34C88A",
        "green2": "#51B56D",
      },
      backgroundImage: {
        "inputInner": "linear-gradient(136.1deg, #26262D -10.3%, #151517 96.4%)",
        "inputOuter": "radial-gradient(circle at 40% -100%, rgba(95, 95, 95, 1), rgba(83, 83, 83, 0))",
        "poolInner": "linear-gradient(-36.23deg, #202020 7.44%, #353535 66.43%)"
      },
      borderRadius: {
        "sm": "9px",
      }
    },
    fontSize: {
      'xl8': ['80px', '100px'],
    },
    fontFamily: {
    }
  },
  plugins: [],
}
