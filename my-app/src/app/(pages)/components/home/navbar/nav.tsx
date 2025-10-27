import React from "react";
import next from "next/link";
import './nav.css'
import Link from "next/link";

const Navbar = () => {
    return (
        <div className="nav-home">
            <div className="nav-home-in">
                <div className="nav-home-in-one">
                    <h1>DevLink</h1>
                </div>
                <div className="nav-home-in-two">
                    <Link href="/">About</Link>
                    <Link href="/">Features</Link>
                    <Link href="/">ShowCase</Link>
                    <Link href="/">Contact</Link>

                </div>
                <div className="nav-home-in-three">
                    <Link href="/login"><button className="nav-home-in-three-log">Login</button></Link>
                    <Link href="/register"><button className="nav-home-in-three-reg">Register</button></Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar;