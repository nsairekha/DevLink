'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import axios from 'axios'

import './sidebar.css'

// import icons here
import { RiHome6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";

const Sidebar = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);

    useEffect(() => {
        checkAdminStatus();
        checkSuspendedStatus();
    }, [user]);

    const checkAdminStatus = async () => {
        try {
            const response = await axios.get('/api/admin/check');
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    };

    const checkSuspendedStatus = async () => {
        if (!user) return;
        
        try {
            const response = await axios.get(`/api/user/check-suspended?userId=${user.id}`);
            setIsSuspended(response.data.isSuspended);
            
            if (response.data.isSuspended) {
                // Auto logout suspended users
                await signOut();
                router.push('/?suspended=true');
            }
        } catch (error) {
            console.error('Error checking suspended status:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="sidebarComponent">
            <div className="sidebarComponent-in">

                <div className="sidebar-logo">
                    <h2>
                        <span className="logo-icon">DL</span>
                        DevLink
                    </h2>
                </div>

                {isSuspended ? (
                    <div className="sidebar-two">
                        <div className="suspended-message">
                            <p>Your account has been suspended.</p>
                            <p>Please contact support for more information.</p>
                        </div>
                        <div className="sidebar-link sidebar-logout" onClick={handleLogout}>
                            <FiLogOut size={20} />
                            <span>Logout</span>
                        </div>
                    </div>
                ) : (
                    <div className="sidebar-two">
                        {isAdmin ? (
                            <>
                                <div className={`sidebar-link ${pathname === '/admin' ? 'active' : ''}`}>
                                    <FaUserShield size={20} />
                                    <Link href="/admin">Admin</Link>
                                </div>
                                <div className={`sidebar-link ${pathname?.startsWith('/admin/analytics') ? 'active' : ''}`}>
                                    <FaChartBar size={20} />
                                    <Link href="/admin/analytics">Analytics</Link>
                                </div>
                                <div className={`sidebar-link ${pathname === '/profile' ? 'active' : ''}`}>
                                    <CgProfile size={20} />
                                    <Link href="/profile">Profile</Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`sidebar-link ${pathname === '/home' ? 'active' : ''}`}>
                                    <RiHome6Line size={20} />
                                    <Link href="/home">Home</Link>
                                </div>
                                <div className={`sidebar-link ${pathname === '/edit-links' ? 'active' : ''}`}>
                                    <MdEdit size={20} />
                                    <Link href="/edit-links">Edit Links</Link>
                                </div>
                                <div className={`sidebar-link ${pathname === '/profile' ? 'active' : ''}`}>
                                    <CgProfile size={20} />
                                    <Link href="/profile">Profile</Link>
                                </div>
                                <div className={`sidebar-link ${pathname === '/theme' ? 'active' : ''}`}>
                                    <IoMdSettings size={20} />
                                    <Link href="/theme">Theme</Link>
                                </div>
                            </>
                        )}
                        <div className="sidebar-link sidebar-logout" onClick={handleLogout}>
                            <FiLogOut size={20} />
                            <span>Logout</span>
                        </div>  
                    </div>
                )}

            </div>
        </div>
    )
}

export default Sidebar