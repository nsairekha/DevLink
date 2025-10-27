"use client"

import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Dashboard from '../components/dashboard/dashboard';
import './admin.css';
import { FaUsers, FaLink, FaEye, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const { userId } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoaded || !userId) return;
        
        // Check if user is admin
        checkAdminAccess();
    }, [isLoaded, userId]);

    const checkAdminAccess = async () => {
        try {
            const response = await axios.get('/api/admin/check');
            if (!response.data.isAdmin) {
                router.push('/home');
                return;
            }
            
            // Fetch admin stats
            await fetchAdminStats();
            await fetchAllUsers();
        } catch (error) {
            console.error('Error checking admin access:', error);
            router.push('/home');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminStats = async () => {
        try {
            const response = await axios.get('/api/admin/stats');
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteUser = async (userId: number, userName: string) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone and will delete all their links and data.`)) {
            return;
        }

        try {
            await axios.delete(`/api/admin/users/${userId}`);
            alert('User deleted successfully');
            await fetchAllUsers(); // Refresh the list
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleToggleSuspend = async (userId: number, currentStatus: boolean, userName: string) => {
        const action = currentStatus ? 'activate' : 'suspend';
        if (!confirm(`Are you sure you want to ${action} user "${userName}"?`)) {
            return;
        }

        try {
            await axios.patch(`/api/admin/users/${userId}/suspend`, {
                suspended: !currentStatus
            });
            alert(`User ${action}d successfully`);
            await fetchAllUsers(); // Refresh the list
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status');
        }
    };

    if (loading) {
        return (
            <Dashboard>
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading admin dashboard...</p>
                </div>
            </Dashboard>
        );
    }

    return (
        <Dashboard>
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>System-wide analytics and user management</p>
                </div>

                {/* Admin Stats */}
                {stats && (
                    <div className="admin-stats">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                <FaUsers style={{ color: '#3b82f6' }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Users</p>
                                <h2 className="stat-value">{stats.totalUsers}</h2>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                                <FaLink style={{ color: '#8b5cf6' }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Links</p>
                                <h2 className="stat-value">{stats.totalLinks}</h2>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                                <FaEye style={{ color: '#22c55e' }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Clicks</p>
                                <h2 className="stat-value">{stats.totalClicks}</h2>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                                <FaChartBar style={{ color: '#ec4899' }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Active Users</p>
                                <h2 className="stat-value">{stats.activeUsers}</h2>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="admin-table-section">
                    <h2>All Users</h2>
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Provider</th>
                                    <th>Status</th>
                                    <th>Links</th>
                                    <th>Clicks</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className={user.is_suspended ? 'suspended-user' : ''}>
                                        <td>{user.id}</td>
                                        <td className="user-name">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.username ? (
                                                <a 
                                                    href={`/${user.username}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="username-link"
                                                >
                                                    @{user.username}
                                                </a>
                                            ) : (
                                                <span className="no-username">Not set</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`provider-badge ${user.provider}`}>
                                                {user.provider}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.is_suspended ? 'suspended' : 'active'}`}>
                                                {user.is_suspended ? 'Suspended' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="numeric">{user.link_count || 0}</td>
                                        <td className="numeric clicks">{user.total_clicks || 0}</td>
                                        <td className="date">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="actions">
                                            <button
                                                className={`action-btn ${user.is_suspended ? 'activate-btn' : 'suspend-btn'}`}
                                                onClick={() => handleToggleSuspend(user.id, user.is_suspended, user.name)}
                                                title={user.is_suspended ? 'Activate user' : 'Suspend user'}
                                            >
                                                {user.is_suspended ? 'Activate' : 'Suspend'}
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                title="Delete user permanently"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default AdminDashboard;
