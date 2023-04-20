/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      display: ['group-focus'],

      margin: {
        68: '272px',
        50: '28vh',
      },
      spacing: {
        5: '3%',
        7: '13%',
        27: '27%',
        35: '35%',
        48: '48%',
        21: '15%',
        31: '32%',
        37: '37%',
        20: '20%',
        50: '50%',
        38: '38%',
        47: '47%',
        45: '45%',
        43: '43%',
        1.9: '1.9%',
        2.1: '2.4%',
        34: '34px',
        46: '46%',
        44: '44%',
        40: '40%',
      },
      backgroundImage: {
        'constructn-image':
          "url('https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png')",
      },
      colors: {
        // Configure your color palette here
        'custom-yellow': '#F2CA52',
        'border-yellow': '#f0ca5269',
        'botton-color': '#F0F0F0',
        'bg-projectPage': '#e3e3e34d',
        'bg-table-row': ' #e0cbcb',
      },
      fontSize: {
        xs: ['0.65rem', '0.65rem'],
      },
      width: {
        128: '410px',
        112: '470px',
        228: '236px',
        500: '500px',
        40: '40vw',
        38: '200px',
        75: '300px',
        70: '280px',
        60: '66vw',
        89: '89vw',
        50: '27.5vw',
        95: '95.2vw',
        97: '97vw',
        96: '96vw',
        98: '98vw',
        100: '100vw',
        1.7: '2.5vw',
        4: '4vw',
        4.1: '4px',
        3: '2.5vw',
        3: '2.5%',
        2.6: '2.6%',
        1: '1vw',
        16: '16px',
        // 20: "20vw",
        97.5: '97.5vw',
        99: '99%',
        98.5: '98.5%',
        2.5: '2.5vw',
        5: '5%',
        3: '1.5vw',
      },
      height: {
        7: '7vh',
        4: '4vh',
        20: '20vh',
        97: '95%',
        25: '25vh',
        84: '84vh',
        65: '65vh',
        35: '35vh',
        145: '45vh',
        75: '250px',
        50: '50vh',
        40: '40vh',
        91: '94vh',
        93: '93vh',
        96: '96vh',
        85: '75vh',
        100: '95vh',
        101: '100vh',
        82: '328px',
        80: '81vh',
        11: '6vh',
        87: '87vh',
      },
    },
  },
  plugins: [],
};
