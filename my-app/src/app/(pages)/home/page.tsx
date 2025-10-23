"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

// imports start here
import Dashboard from '../components/dashboard/dashboard';

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
            <div className="HomeComponent">
                <div className="HomeComponent-in">
                    <div className="HomeComponent-one">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Dashboard>
            <div className="HomeComponent">
                <div className="HomeComponent-in">
                     
                </div>
            </div>
        </Dashboard>
    )
}

export default DashboardPage;