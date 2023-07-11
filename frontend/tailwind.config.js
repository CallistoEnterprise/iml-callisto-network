module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0px -2px 7px black',
      },
      screens: {
        "sm": { 'min': '600px' },
        "md": { 'min': '768px' },
        "1xl": { 'min': '1200px' },
        "2xl": { 'min': '1236px' },
      },
      colors: {
        "black1": "#0C0C0D",
        "black2": "#2B2B2E",
        "black3": "#AAA",
        "blue1": "#75A3FE",
        "blue2": "#524EEE",
        "grey1": "#717171",
        "grey2": "#7C7C7C",
        "grey3": "#484848",
        "grey4": "#343434",
        "grey5": "#2E3540",
        "grey6": "#929292",
        "grey7": "#2B2B2B",
        "grey8": "#393939",
        "grey9": "#141417",
        "green1": "#34C88A",
        "green2": "#51B56D",
        "green3": "#36DDAB",
        "red1": "#FE6B6B",
        "panelyellow": "rgba(255, 255, 0, 0.1)",
        "panelgreen": "rgba(81, 181, 109, 0.1)"
      },
      backgroundImage: {
        "inputInner": "linear-gradient(136.1deg, #26262D -10.3%, #151517 96.4%)",
        "inputOuter": "radial-gradient(circle at 40% -100%, rgba(95, 95, 95, 1), rgba(83, 83, 83, 0))",
        "poolInner": "linear-gradient(-36.23deg, #202020 7.44%, #353535 66.43%)",
        "moneyInner": "linear-gradient(#1F1E1E 68%, #282828 81%)",
        "claim": "linear-gradient(101.49deg, rgba(217, 217, 217, 0.47) 2.84%, rgba(217, 217, 217, 0.28) 135.8%)",
        "creditBack": "radial-gradient(#9A9A9A 100%, #313131 48%)",
        "pp": "url('/public/images/Component 1.png')",
        "pp1": "url('/public/images/Component 2.png')",
        "pad": "linear-gradient(122.37deg, rgba(31, 30, 30, 0.68) 0%, rgba(40, 40, 40, 0.81) 98.28%)",
      },
      borderRadius: {
        "tiny": "5px",
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
  corePlugins: {
    backdropOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    ringOpacity: false,
    textOpacity: false
  }
}