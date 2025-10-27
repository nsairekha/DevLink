"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
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
import { FaLink, FaEye, FaMousePointer, FaCalendar } from 'react-icons/fa';

// imports start here
import Dashboard from '../components/dashboard/dashboard';
import './page.css';

// Register ChartJS components
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

const DashboardPage = () => {

    const { isSignedIn, userId } = useAuth();
    const { user, isLoaded } = useUser()

    const [userData, setUserData] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!isLoaded || !userId) return;

        const fetchUserData = async () => {
            try {
                // Check if user is admin
                const adminCheck = await axios.get('/api/admin/check');
                if (adminCheck.data.isAdmin) {
                    router.push('/admin');
                    return;
                }

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
                
                // Fetch analytics
                const analyticsResponse = await axios.get('/api/analytics', {
                    params: { userId: userId }
                });
                setAnalytics(analyticsResponse.data.analytics);
                
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

    // Prepare chart data
    const clicksByTypeData = {
        labels: analytics.clicksByType.map((item: any) => 
            item.link_type === 'social' ? 'Social Links' : 'Project Links'
        ),
        datasets: [{
            label: 'Clicks by Type',
            data: analytics.clicksByType.map((item: any) => item.clicks),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(139, 92, 246, 0.8)',
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(139, 92, 246, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const linkTypeDistributionData = {
        labels: analytics.linkTypeDistribution.map((item: any) => 
            item.link_type === 'social' ? 'Social Links' : 'Project Links'
        ),
        datasets: [{
            label: 'Link Distribution',
            data: analytics.linkTypeDistribution.map((item: any) => item.count),
            backgroundColor: [
                'rgba(236, 72, 153, 0.8)',
                'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: [
                'rgba(236, 72, 153, 1)',
                'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const topLinksData = {
        labels: analytics.topLinks.map((link: any) => link.title),
        datasets: [{
            label: 'Clicks',
            data: analytics.topLinks.map((link: any) => link.clicks),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    }
                }
            },
        },
    };

    return (
        <Dashboard>
            <div className="analytics-container">
                <div className="analytics-header">
                    <h1>Analytics Dashboard</h1>
                    <p>Track your DevLink performance</p>
                </div>

                {/* Summary Cards */}
                <div className="analytics-summary">
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            <FaLink style={{ color: '#3b82f6' }} />
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
                            <p className="summary-label">Visible Links</p>
                            <h2 className="summary-value">{analytics.summary.visibleLinks}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                            <FaMousePointer style={{ color: '#ec4899' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Clicks</p>
                            <h2 className="summary-value">{analytics.summary.totalClicks}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                            <FaCalendar style={{ color: '#8b5cf6' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Member Since</p>
                            <h2 className="summary-value" style={{ fontSize: '1rem' }}>
                                {new Date(analytics.summary.accountCreatedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    year: 'numeric' 
                                })}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="analytics-charts">
                    {/* Top Links Chart */}
                    {analytics.topLinks.length > 0 && (
                        <div className="chart-card">
                            <h3>Top Performing Links</h3>
                            <div className="chart-container">
                                <Bar data={topLinksData} options={chartOptions} />
                            </div>
                        </div>
                    )}

                    {/* Clicks by Type */}
                    {analytics.clicksByType.length > 0 && (
                        <div className="chart-card">
                            <h3>Clicks by Link Type</h3>
                            <div className="chart-container">
                                <Bar data={clicksByTypeData} options={chartOptions} />
                            </div>
                        </div>
                    )}

                    {/* Link Distribution */}
                    {analytics.linkTypeDistribution.length > 0 && (
                        <div className="chart-card chart-card-small">
                            <h3>Link Type Distribution</h3>
                            <div className="chart-container">
                                <Doughnut data={linkTypeDistributionData} options={chartOptions} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Top Links Table */}
                {analytics.topLinks.length > 0 && (
                    <div className="analytics-table">
                        <h3>Top 5 Links</h3>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Link Title</th>
                                        <th>Type</th>
                                        <th>Clicks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.topLinks.map((link: any, index: number) => (
                                        <tr key={index}>
                                            <td>
                                                <span className="rank-badge">#{index + 1}</span>
                                            </td>
                                            <td className="link-title">{link.title}</td>
                                            <td>
                                                <span className={`type-badge ${link.link_type}`}>
                                                    {link.link_type === 'social' ? 'Social' : 'Project'}
                                                </span>
                                            </td>
                                            <td className="clicks-count">{link.clicks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Dashboard>
    )
}

export default DashboardPage;