"use client"

import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Dashboard from '../../components/dashboard/dashboard';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaUsers, FaLink, FaEye, FaCalendar } from 'react-icons/fa';

import './page.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminAnalyticsPage = () => {
    const { userId } = useAuth();
    const { isLoaded } = useUser();
    const router = useRouter();

    const [dateRange, setDateRange] = useState('30');
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/api/admin/analytics', {
                params: { dateRange },
            });
            setAnalytics(response.data.analytics);
        } catch (error) {
            console.error('Error fetching admin analytics:', error);
        }
    };

    useEffect(() => {
        if (!isLoaded || !userId) return;

        const init = async () => {
            try {
                const adminCheck = await axios.get('/api/admin/check');
                if (!adminCheck.data.isAdmin) {
                    router.push('/home');
                    return;
                }
                await fetchAnalytics();
            } catch (e) {
                router.push('/home');
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, [isLoaded, userId]);

    useEffect(() => {
        if (!isLoading) {
            fetchAnalytics();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    if (isLoading) {
        return (
            <Dashboard>
                <div className="analytics-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </Dashboard>
        );
    }

    if (!analytics) {
        return (
            <Dashboard>
                <div className="analytics-loading">
                    <p>No analytics data available</p>
                </div>
            </Dashboard>
        );
    }

    const clicksByTypeData = {
        labels: (analytics.clicksByType || []).map((i: any) => i.link_type === 'social' ? 'Social Links' : 'Project Links'),
        datasets: [{
            label: 'Clicks by Type',
            data: (analytics.clicksByType || []).map((i: any) => i.clicks),
            backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)'],
            borderColor: ['rgba(59, 130, 246, 1)', 'rgba(139, 92, 246, 1)'],
            borderWidth: 2,
        }],
    };

    const linkTypeDistributionData = {
        labels: (analytics.linkTypeDistribution || []).map((i: any) => i.link_type === 'social' ? 'Social Links' : 'Project Links'),
        datasets: [{
            label: 'Link Distribution',
            data: (analytics.linkTypeDistribution || []).map((i: any) => i.count),
            backgroundColor: ['rgba(236, 72, 153, 0.8)', 'rgba(245, 158, 11, 0.8)'],
            borderColor: ['rgba(236, 72, 153, 1)', 'rgba(245, 158, 11, 1)'],
            borderWidth: 2,
        }],
    };

    const clicksPerDayData = {
        labels: (analytics.clicksPerDay || []).map((i: any) => new Date(i.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'Total Clicks per Day',
            data: (analytics.clicksPerDay || []).map((i: any) => i.clicks),
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.3,
            fill: true,
        }],
    };

    const newUsersByDayData = {
        labels: (analytics.newUsersByDay || []).map((i: any) => new Date(i.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'New Users per Day',
            data: (analytics.newUsersByDay || []).map((i: any) => i.count),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' as const } },
    };

    return (
        <Dashboard>
            <div className="analytics-container">
                <div className="analytics-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Admin Analytics</h1>
                            <p>Aggregated metrics across all users</p>
                        </div>
                        <div className="header-right">
                            <div className="header-actions">
                                <select 
                                    value={dateRange} 
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="date-range-select"
                                >
                                    <option value="7">Last 7 days</option>
                                    <option value="30">Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div 
                    className="analytics-summary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            <FaUsers style={{ color: '#3b82f6' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Users</p>
                            <h2 className="summary-value">{analytics.summary.totalUsers}</h2>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                            <FaLink style={{ color: '#8b5cf6' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Links</p>
                            <h2 className="summary-value">{analytics.summary.totalLinks}</h2>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                            <FaEye style={{ color: '#22c55e' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Clicks</p>
                            <h2 className="summary-value">{analytics.summary.totalClicks}</h2>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                            <FaCalendar style={{ color: '#f59e0b' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Window Start</p>
                            <h2 className="summary-value" style={{ fontSize: '1rem' }}>
                                {new Date(analytics.summary.windowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </h2>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="analytics-charts"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="chart-card">
                        <h3>Clicks Across Platform (Daily)</h3>
                        <div className="chart-container">
                            <Line data={clicksPerDayData} options={chartOptions} />
                        </div>
                    </div>

                    {(analytics.clicksByType || []).length > 0 && (
                        <div className="chart-card">
                            <h3>Clicks by Link Type</h3>
                            <div className="chart-container">
                                <Bar data={clicksByTypeData} options={chartOptions} />
                            </div>
                        </div>
                    )}

                    {(analytics.linkTypeDistribution || []).length > 0 && (
                        <div className="chart-card chart-card-small">
                            <h3>Link Type Distribution</h3>
                            <div className="chart-container">
                                <Doughnut data={linkTypeDistributionData} options={chartOptions} />
                            </div>
                        </div>
                    )}
                </motion.div>

                {(analytics.topUsers || []).length > 0 && (
                    <motion.div 
                        className="analytics-table"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h3>Top Users by Clicks</h3>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Total Clicks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.topUsers.map((u: any, index: number) => (
                                        <tr key={u.id}>
                                            <td><span className="rank-badge">#{index + 1}</span></td>
                                            <td className="user-name">{u.name || '—'}</td>
                                            <td>
                                                {u.username ? (
                                                    <a href={`/${u.username}`} target="_blank" rel="noopener noreferrer" className="username-link">@{u.username}</a>
                                                ) : (
                                                    <span className="no-username">Not set</span>
                                                )}
                                            </td>
                                            <td className="clicks-count">{u.total_clicks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </Dashboard>
    );
};

export default AdminAnalyticsPage;


