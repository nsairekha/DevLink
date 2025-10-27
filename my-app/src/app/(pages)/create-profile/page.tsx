"use client"
import React, { useEffect } from 'react'
import { useAuth, useUser,  } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import './page.css';

const page = () => {
    const router = useRouter();
    
    const [name, setName] = React.useState("");
    const [isAvailable, setIsAvailable] = React.useState<boolean | null>(null);
    const [isCheckingUser, setIsCheckingUser] = React.useState(true);

    const { userId, isLoaded } = useAuth();       
    const { user } = useUser(); 

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

                console.log("User data response:", response);

                if (response && response.status === 200 && response.data.user && response.data.user.length > 0 && response.data.user[0].username !== null) {
                    router.push('/dashboard')
                    return;
                }
            } catch (error) {
                console.log("Error fetching user data:", error);
            } finally {
                setIsCheckingUser(false);
            }
        }
        fetchUserData();
    }, [isLoaded, userId, router])

    useEffect(() => {
        // check the username availability logic
        const checkUsernameAvailability = async () => {
            try {
               const response = await axios.post('/api/check-username', { username: name });

               if (response.status === 200) {
                    setIsAvailable(true);
               }
               else {
                    setIsAvailable(false);
               }
            } catch (error) {
                setIsAvailable(false);
            }
        }

        if (name.length > 2) {
            checkUsernameAvailability();
        }
    }, [name]);


    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/user', {
                username: name,
                clerk_user_id: user?.id,
                email: user?.emailAddresses[0]?.emailAddress,
                name: user?.fullName,
                imageUrl: (user as any)?.profileImageUrl,
                provider: 'clerk'
            });

            if (response.status === 200) {
               router.push('/home');           
            }
        } catch (error) {
            console.log("Error creating profile:", error);
        }
    }

    if (isCheckingUser) {
        return (
            <div className="CreateProfileComponent">
                <div className="CreateProfileComponent-in">
                    <div className="createProfile-one">
                        <div className="createProfile-one-one">
                            <h1>Checking Profile...</h1>
                            <p>Please wait while we check your profile status</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="CreateProfileComponent">
            <div className="CreateProfileComponent-in">
                <div className="createProfile-one">
                    <div className="createProfile-one-one">
                        <h1>Create Your Profile</h1>
                        <p>Set up your DevLink profile</p>
                    </div>
                    <div className="createProfile-one-two">
                        <input 
                            type="text"
                            placeholder="choose a username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name='name'
                        />
                        {isAvailable === true && (<div className="availability available">Username is available!</div>
                        )}
                        {isAvailable === false && (
                            <div className="availability not-available">Username is taken.</div>
                        )}
                    </div>
                    <div className="createProfile-one-three">
                        <button
                            disabled={!isAvailable}
                            className="create-profile-button"
                            onClick={handleSubmit}
                        >
                            Create Profile
                        </button>
                    </div>  
                </div>
                <div className="createProfile-two">
                    <img
                        src="https://i.pinimg.com/1200x/ef/78/99/ef7899d792526a5d10f33c30ad250617.jpg"
                        alt="Login Image"
                        width={400}
                        height={400}
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    )
}
export default page