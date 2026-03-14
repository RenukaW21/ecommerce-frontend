
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';


const ProfileDropdown = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle dropdown
    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close dropdown and navigate
    const handleNavigation = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            <div className={`profile-toggle ${isOpen ? 'active' : ''}`} onClick={toggleDropdown}>
                <div className="utility-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    </svg>
                </div>
                <span className="utility-label">Profile</span>
            </div>

            <div className={`profile-menu ${isOpen ? 'is-open' : ''}`}>
                <div className="profile-welcome-section">
                    {!user ? (
                        <>
                            <h3 className="welcome-title">Welcome</h3>
                            <p className="welcome-subtitle">To access account and manage orders</p>
                            <button className="login-signup-btn" onClick={() => handleNavigation('/login')}>
                                LOGIN / SIGNUP
                            </button>
                        </>
                    ) : (
                        // <>
                        //    /* <h3 className="welcome-title">Hello, {user.name?.split(' ')[0]}</h3>
                        //     <p className="welcome-subtitle">{user.email || user.phone}</p> */
                        // </>
                        <>
                            <h3 className="welcome-title">Hello,{user.name?.split(' ')[0]}</h3>
                            {user?.name && (
  <h3 className="welcome-title">
    Hello, {user.name.split(' ')[0]}
  </h3>
)} 

                            <p className="welcome-subtitle">To access account and manage orders</p>
                            <button className="login-signup-btn" onClick={() => handleNavigation('/login')}>
                                LOGIN / SIGNUP
                            </button>
                        </>
                    )}
                </div>

                <div className="dropdown-divider"></div>

                <ul className="dropdown-list">
                    <li onClick={() => handleNavigation('/orders')}>Orders</li>
                    <li onClick={() => handleNavigation('/wishlist')}>Wishlist</li>
                    <li onClick={() => handleNavigation('/contact')}>Contact Us</li>
                    {/* <li className="with-tag">
                        Myntra Insider <span className="new-tag">New</span>
                    </li> */}
                </ul>

                <div className="dropdown-divider"></div>

                {/* <ul className="dropdown-list">
                    <li>Myntra Credit</li>
                    <li>Coupons</li>
                    <li>Saved Cards</li>
                    <li>Saved VPA</li>
                    <li>Saved Addresses</li>
                </ul> */}

                {user && (
                    <>
                        <div className="dropdown-divider"></div>
                        <ul className="dropdown-list">
                            <li onClick={() => handleNavigation('/profile')}>Edit Profile</li>
                            <li onClick={() => { setIsOpen(false); onLogout(); }} className="logout-text">Logout</li>
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};


export default ProfileDropdown;
