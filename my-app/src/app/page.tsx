import Image from "next/image";
import Link from "next/link";
// import Navbar from "./(pages)/components/home/navbar/nav";
import HeroSection from "./(pages)/components/home/herosection/herosection"; 

export default function Home() {
  return (
    <>
      
      <HeroSection />

      {/*
        <div className="HomeComponent">
            <div className="HomeComponent-in">
                <h1>DevLink</h1>
                <p>DevLink is a platform to share their links and projects</p>
                <Link href="/login" >Login</Link>
            </div>
        </div>
      */}
    </>
  );
}
