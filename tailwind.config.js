/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      display: ["group-focus"],

      margin: {
        68: "272px",
      },
      spacing: {
        5: "3%",
        7: "13%",
        27: "27%",
        35: "35%",
        48: "48%",
        21: "15%",
      },

      colors: {
        // Configure your color palette here
        "custom-yellow": "#F2CA52",
        "border-yellow": "#f0ca5269",
        "botton-color": "#F0F0F0",
        "bg-projectPage": "#e3e3e34d",
        "bg-table-row": " #e0cbcb",
      },
      width: {
        128: "410px",
        112: "470px",
        228: "236px",
        500: "500px",
        40: "40vw",
        38: "200px",
        75: "300px",
        70: "280px",
        60: "66vw",
        89: "89vw",
        50: "27.5vw",
        95: "96.9vw",
        97: "97vw",
        100: "100vw",
        4: "4vw",
      },
      height: {
        7: "7vh",
        87: "84vh",
        65: "65vh",
        35: "35vh",
        145: "45vh",
        75: "250px",
        50: "50vh",
        40: "40vh",
        91: "94vh",
        93: "93vh",
        96: "96vh",
        85: "75vh",
        100: "95vh",
        101: "100vh",
        82: "328px",
        11: "6vh",
      },
    },
  },
  plugins: [],
};
