"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

const DashboardPage = () => {

    const { isSignedIn, userId } = useAuth();
    const { user, isLoaded } = useUser()

    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!isLoaded || !userId) return;
        
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/', {
                    params: { userId: userId },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response || response.status !== 200 || !response.data.user || response.data.user.length === 0) {
                    router.push('/create-profile')
                    return;
                }

                const data = await response.data;
                sessionStorage.setItem('userData', JSON.stringify(data));
                console.log("Dashboard user data:", data);
                setUserData(data);
            } catch (error) {
                console.log("Error fetching user data:", error);
                router.push('/create-profile');
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserData();
    }, [isLoaded, router, userId]);

    console.log("Rendered userData:", userData);

    if (isLoading) {
        return (
            <div className="dashboardComponent">
                <div className="dashboardComponent-in">
                    <div className="dashboard-one">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboardComponent">
            <div className="dashboardComponent-in">
                <div className="dashboard-one">
                    {userData && (
                        <div>
                            <p>Welcome, {userData.user[0].name}!</p>
                            <p>Email: {userData.user[0].email}</p>
                            <p>Provider: {userData.user[0].provider}</p>
                            <p>username: {userData.user[0].username}</p>
                        </div>
                    )}
                </div>
                <div className="dashboard-two">

                </div>
            </div>
        </div>
    )
}

export default DashboardPage;