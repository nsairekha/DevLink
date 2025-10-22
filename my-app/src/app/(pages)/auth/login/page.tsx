"use client";

import React from "react";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import "./page.css";

const Page = () => {
  const { signIn, isLoaded } = useSignIn();

  const handleOAuth = async (provider: "oauth_google" | "oauth_github") => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/dashboard",  
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("OAuth error:", err);
    }
  };

  return (
    <div className="LoginComponent">
      <div className="LoginComponent-in">
        <div className="login-one">
          <div className="login-one-one">
            <h1>Welcome Back</h1>
            <p>Log in to your DevLink</p>
          </div>

          <div className="login-one-two">
            <button
              className="login-one-two-one"
              onClick={() => handleOAuth("oauth_google")}
            >
              <FcGoogle />
              <span>Sign in with Google</span>
            </button>

            <button
              className="login-one-two-two"
              onClick={() => handleOAuth("oauth_github")}
            >
              <IoLogoGithub />
              <span>Sign in with GitHub</span>
            </button>
          </div>
        </div>

        <div className="login-two">
          <Image
            src="https://i.pinimg.com/1200x/ef/78/99/ef7899d792526a5d10f33c30ad250617.jpg"
            alt="Login Image"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
