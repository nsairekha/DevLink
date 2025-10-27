import React from "react";
import next  from "next";
import "./herosection.css";
import Navbar from "../navbar/nav";

const HeroSection =() => {
    return (
        <div className="herosection-home">
            <div className="herosection-home-in">
                <Navbar />
                <div className="herosection-home-in-hero">
                <div className="herosection-home-in-one">
                    <div className="herosection-home-in-one-a">
                        <h1>A link in bio built for you.</h1>
                    </div>
                    <div className="herosection-home-in-one-b">
                        <p>Join 70M+ people using Linktree for their link in bio. 
                            One link to help you share everything you create, curate 
                            and sell from your Instagram, TikTok, Twitter, YouTube and 
                            other social media profiles.
                        </p>
                    </div>
                    {/* <div className="herosection-home-in-one-c">
                        
                    </div> */}
                </div>
                <div className="herosection-home-in-two">
                    <h1>hello</h1>
                </div>
                </div>
            </div>

        </div>
    )
}

export default HeroSection;