
import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {
        name: 'Guest User',
        email: 'guest@example.com',
        phone: '+1 234 567 890'
    };

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally call an API to update the profile
        console.log('Updating profile:', formData);
        setIsEditing(false);
        // Mock update local storage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className="profile-page-container">
            <div className="profile-card reveal">
                <div className="profile-hero">
                    <div className="profile-avatar-large">
                        {getInitial(formData.name)}
                    </div>
                    <h2 className="profile-title">{isEditing ? 'Edit Profile' : 'My Account'}</h2>
                    <p className="profile-subtitle">Manage your personal information and preferences</p>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="profile-form-grid">
                        <div className="form-item">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing ? 'disabled-input' : ''}
                                required
                            />
                        </div>

                        <div className="form-item">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing ? 'disabled-input' : ''}
                                required
                            />
                        </div>

                        <div className="form-item">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing ? 'disabled-input' : ''}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-item">
                            <label>Country</label>
                            <input
                                type="text"
                                value="United States"
                                disabled
                                className="disabled-input"
                            />
                        </div>
                    </div>

                    <div className="profile-form-actions">
                        {isEditing ? (
                            <>
                                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}>
                                Edit Profile Details
                            </button>
                        )}
                    </div>
                </form>

                <div className="profile-security-section">
                    <h3>Security & Connectivity</h3>
                    <div className="security-item">
                        <div className="security-info">
                            <span className="security-label">Two-Factor Authentication</span>
                            <span className="security-status">Disabled</span>
                        </div>
                        <button className="security-action">Enable</button>
                    </div>
                    <div className="security-item">
                        <div className="security-info">
                            <span className="security-label">Account Recovery Email</span>
                            <span className="security-status">{formData.email}</span>
                        </div>
                        <button className="security-action">Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
