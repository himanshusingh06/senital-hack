import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsHouseDoor, BsListUl } from 'react-icons/bs';
import './DoctorDashboard.css';
import axios from 'axios';

const DoctorDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [activeNavItem, setActiveNavItem] = useState('Dashboard');
    const [doctorProfile, setDoctorProfile] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) {
                console.log('Access token missing, redirecting to login.');
                navigate('/accounts/login');
                return;
            }

            try {
                // Fetch doctor profile
                const profileResponse = await axios.get('http://127.0.0.1:8000/clinic/doctor/', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setDoctorProfile(profileResponse.data);

                // Fetch appointments for the doctor within next 24 hours
                const appointmentsResponse = await axios.get(`http://127.0.0.1:8000/clinic/appointments/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setAppointments(appointmentsResponse.data);

            } catch (error) {
                console.error('Failed to fetch data', error);
                navigate('/accounts/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accessToken, navigate]);

    const handleNavClick = (navItem: string) => {
        setActiveNavItem(navItem);
        setSelectedDetail(null);
    };

    const handleItemClick = (item: any) => {
        setSelectedDetail(item);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="company-profile">
                    <div className="company-image">
                        <div className="image-placeholder">Image</div>
                    </div>
                    <div className="company-info">
                        <h3>{doctorProfile?.full_name || 'Doctor Name'}</h3>
                        <p>{doctorProfile?.specialization || 'Specialist'}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {['Dashboard', 'Appointments'].map((item) => (
                            <li
                                key={item}
                                className={activeNavItem === item ? 'active' : ''}
                                onClick={() => handleNavClick(item)}
                            >
                                {item === 'Dashboard' && <BsHouseDoor />}
                                {item === 'Appointments' && <BsListUl />}
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {activeNavItem === 'Dashboard' && (
                    <div className="dashboard-main">
                        <h1>Welcome, Dr. {doctorProfile?.full_name}</h1>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h2>{appointments.length}</h2>
                                <p>Appointments in next 24h</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeNavItem === 'Appointments' && (
                    <div className="appointments-main">
                        <h1>Upcoming Appointments</h1>
                        <div className="list-container">
                            {appointments.length === 0 ? (
                                <p>No appointments in next 24 hours.</p>
                            ) : (
                                appointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="list-item"
                                        onClick={() => handleItemClick(appointment)}
                                    >
                                        <h3>Patient: {appointment.patient_details.phone}</h3>
                                        <p>Time: {new Date(appointment.appointment_date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                    })};</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Detail view */}
                        {selectedDetail && (
                            <div className="detail-view">
                                <h2>Appointment Detail</h2>
                                <p><strong>Patient:</strong> {selectedDetail.patient_details.phone}</p>
                                <p><strong>Start Time:</strong> {new Date(selectedDetail.appointment_date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                    })};</p>
                                <p><strong>Reason:</strong> {selectedDetail.reason}</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
