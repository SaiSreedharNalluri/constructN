"use client";
import React from "react";
import styles from "./signup.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email: '',
    password: '',
  });
  const handlefirstNameChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, firstName: value }));
  };

  const handlelastNameChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, lastName: value }));
  };

  const handleEmailChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, email: value }));
  };

  const handlePasswordChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, password: value }));
  };
  const handlecPasswordChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setFormData((prevData: any) => ({ ...prevData, cpassword: value }));
  };

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://api.dev2.constructn.ai/api/v1/users/register', formData);

      if (response) {
        const data = response.data;
        
        alert('Sign Up SuccessFull');
        console.log('API Response:', data);
        
        router.push('/');
      } else {
        console.error('Error:', Error);
        
      }
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  return (

    <main className={styles.main}>
      <div>
      <div className={styles.Upper1}>
         <img src="https://app.constructn.ai/_next/static/media/logo-yellow.1fc0a594.svg" alt="Logo" />
       </div>
        
        {/* <div className={styles.pp}> */}
          {/* <div className={styles.middleleft}>
            <div className={styles.middleleft1}><h5>Home</h5></div>
          </div> */}


          <div className={styles.groove}>
            <div className={styles.one}>
           <h4 className={styles.signin}>Sign up</h4>
           <div className={styles.holder}> First Name:</div>
            <input className={styles.oneinput}
              type="text"
              name="firstNmae"
              placeholder=""
              max="20"
              onChange={handlefirstNameChange}
              align-content="center"
            />
            <br />
           <div className={styles.holder} >LastName:</div>
            <input className={styles.oneinput}
              type="text"
              name="lastName"
              placeholder=""
              max="20"
              onChange={handlelastNameChange}
              align-content="center"
            />
            <br />
            <div className={styles.holder}> email :</div>
            <input className={styles.oneinput}
              type="text"
              name="e-mail"
              placeholder=""
              max="20"
              onChange={handleEmailChange}
              align-content="center"
            />
            <br />
            <div className={styles.holder}>Password:</div>
            <input className={styles.oneinput}
              type="text"
              name="password"
              placeholder=""
              max="20"
              onChange={handlePasswordChange}
              align-content="center"
            />
            <div className={styles.holder}>Conform-Password:</div>
            <input className={styles.oneinput}
              type="text"
              name="Conform-Password"
              placeholder=""
              max="20"
              onChange={handlecPasswordChange}
              align-content="center"
            />
            
            <br />
            <div>
           {/* <div className={styles.holder}>Address:</div>
              <textarea rows={3} className={styles.input} cols={18}></textarea> */}
            </div> 
            <div className={styles.Upper2}>
          
            <input className={styles.input3} type="checkbox" />
                <h5>I agree to the
                <a target="_blank" href="https://constructn.ai/terms-conditions/">
                  Terms and Conditions 
                </a></h5>
              </div>
            <button 
              className={styles.button2}
              onClick={handleFormSubmit}
             
            >
              
              Signup
            </button>
           </div >
          </div>
        </div>
    
    </main>
  );
}
