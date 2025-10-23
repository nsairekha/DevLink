import React from 'react'
import Link from 'next/link'

import './sidebar.css'

// import icons here
import { RiHome6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

const Sidebar = () => {
    return (
        <div className="sidebarComponent">
            <div className="sidebarComponent-in">

                <div className="sidebar-one">
                    <h1>DevLink</h1>
                </div>

                <div className="sidebar-two">
                    <div className="sidebar-link">
                        <RiHome6Line size={20} />
                        <Link href="/">Home</Link>
                    </div>
                    <div className="sidebar-link">
                        <MdEdit size={20} />
                        <Link href="/edit-links">Edit Links</Link>
                    </div>
                    <div className="sidebar-link">
                        <CgProfile size={20} />
                        <Link href="/profile">Profile</Link>
                    </div>
                    <div className="sidebar-link">
                        <IoMdSettings size={20} />
                        <Link href="/settings">Settings</Link>
                    </div>
                    <div className="sidebar-link">
                        <FiLogOut size={20} />
                        <Link href="/sign-out">Logout</Link>
                    </div>  
                </div>

            </div>
        </div>
    )
}

export default Sidebar