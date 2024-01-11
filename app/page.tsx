"use client";
import styles from "./abc.module.css";
import { useState } from "react";
 import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import { LockOutlined } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Console } from "console";
import axios from 'axios';
import { routeModule } from "next/dist/build/templates/pages";
import {setCookie} from "nookies";
// Import React and other necessary modules.

// export default function Home() {

//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });

//   const handleEmailChange = (event:{target:{value:any}}) => {
//     const { value } = event.target;
//     setFormData((prevData) => ({ ...prevData, username: value }));
//   };

//   const handleInputChange = (event:{target:{value:any}}) => {
//     const { value } = event.target;
//     setFormData((prevData) => ({ ...prevData, password: value }));
//   };

//   const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('https://api.dev2.constructn.ai/api/v1/users/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('API Response:', data);
//         // Additional logic based on the response
//       } else {
//         const errorData = await response.json();
//         // console.error('Error:', response.status, response.statusText, errorData);
//         // Handle error appropriately
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       // Handle error appropriately
//     }
//   };


//   return (
//     <main className={styles.main}>
//       <div className={styles.Upper1}>
//         <img src="https://app.constructn.ai/_next/static/media/logo-yellow.1fc0a594.svg" alt="Logo" />
//       </div>

//       <form className={styles.groove} onSubmit={handleFormSubmit}>
//         <div className={styles.one}>
//           <span className={styles.lock}><LockOutlinedIcon fontSize="small" /></span>
//           <br />
//           <h4 className={styles.signin}>Sign in</h4>

//           <fieldset>
//             <legend>E-mail</legend>
//             <input
//               type="text"
//               name="username"
//               placeholder="E-mail"
//               onChange={handleEmailChange}
//             />
//           </fieldset>
//         </div>
//         <br />
//         <div className={styles.one}>
//           <fieldset>
//             <legend>Password</legend>
//             <input
//               type="password" // Use type="password" for password fields
//               name="password"
//               placeholder="PASSWORD"
//               maxLength={20}
//               onChange={handleInputChange}
//             />
//           </fieldset>
//         </div>
//         <a href="https://app.constructn.ai/forgot_password">
//           <h5>Forgot Password?</h5>
//         </a>
//         <div className={styles.btn}>
//           <button
//             type="submit"
//             className={styles.button1} // Remove this line
//           >
//             Login
//           </button>
//           <br />
//           <div>
//             {/* 'submit' should be the type for form submission */}
//             {/* <button
//               type="submit"
//               className={styles.button2}
//               //  onClick={}
//             >
//               Signup
//             </button> */}
//           </div>
//         </div>
//       </form>
//     </main>
//   );
// }


export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleEmailChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, email: value }));
  };

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, password: value }));
  };

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://api.dev2.constructn.ai/api/v1/users/signin', formData);

      if (response) {
        const data = response.data.result.token;
        const data2=response.data.result.refreshToken;
        console.log('API Response:', data);
        // Additional logic based on the response          const { token, refreshtoken } = response.data;
    
          // Store the tokens in a cookie
          setCookie(null, 'authTokens', JSON.stringify({ data,data2 }), { path: '/' });
    
          // console.log('Access Token:', token);
          // console.log('Refresh Token:', refreshtoken);
      } else {
        console.error('Error:', Error);
        // Handle error appropriately
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
  };

  return (
      <main className={styles.main}>
       <div className={styles.Upper1}>
         <img src="https://app.constructn.ai/_next/static/media/logo-yellow.1fc0a594.svg" alt="Logo" />
       </div>

       <form className={styles.groove} onSubmit={handleFormSubmit}>
         <div className={styles.one}>
           <span className={styles.lock}><LockOutlinedIcon fontSize="small" /></span>
           <br />
           <h4 className={styles.signin}>Sign in</h4>
           {/* <fieldset>
             <legend>E-mail</legend> */}
           <input
              type="text"
              name="email"
              placeholder="E-mail"
              onChange={handleEmailChange}
            />
          {/* </fieldset> */}
        </div>
        <br />

        <div className={styles.one}>
          {/* <fieldset>
            <legend>Password</legend> */}
            <input
              type="password" // Use type="password" for password fields
              name="password"
              placeholder="PASSWORD"
              maxLength={20}
              onChange={handleInputChange}
            />
          {/* </fieldset> */}
        </div>
        <a href="https://app.constructn.ai/forgot_password">
          <h5>Forgot Password?</h5>
        </a>
        <div className={styles.btn}>
          <button
            type="submit"
            className={styles.button1} // Remove this line
            onClick={() => router.push("login")}
          >
            Login
          </button>
          <br />
         <h5 className={styles.user1}>new user?signup</h5> 
          <div>
          
             <button
              type="submit"
              className={styles.button2}
               onClick={() => router.push("signup")}
            >
              Signup
            </button> 
          </div>
        </div>
      </form>
    </main>
  );
}
