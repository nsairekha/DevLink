import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
        <div className="HomeComponent">
            <div className="HomeComponent-in">
                <h1>DevLink</h1>
                <p>DevLink is a platform to share their links and projects</p>
                <Link href="/login" >Login</Link>
            </div>
        </div>
  );
}
