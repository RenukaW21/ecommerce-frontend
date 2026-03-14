
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        // Mock API call
        console.log('Changing password...');
        setTimeout(() => {
            setSuccess("Password changed successfully!");
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => navigate('/profile'), 2000);
        }, 1000);
    };

    return (
        <div className="security-page-wrapper">
            <div className="security-card reveal">
                <div className="security-header">
                    <div className="lock-icon-bg">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0110 0v4"></path>
                        </svg>
                    </div>
                    <h2>Update Security</h2>
                    <p>Keep your account safe by using a strong, unique password</p>
                </div>

                {error && <div className="auth-alert error-alert">{error}</div>}
                {success && <div className="auth-alert success-alert">{success}</div>}

                <form onSubmit={handleSubmit} className="security-form">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Enter current password"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Min. 8 characters"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Repeat new password"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="security-form-footer">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/profile')}>
                            Go Back
                        </button>
                        <button type="submit" className="auth-btn">
                            Save Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
