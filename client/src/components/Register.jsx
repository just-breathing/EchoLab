import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/lang/python');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/register', userData);
            navigate("/login");
        } catch (err) {
            if (err.response.data.error) {
                console.log(err)
                setErrorMessage(err.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            console.error(err);
        }
    };

    return (
        <div>
            <div className='form-container'>
            <h2>Register</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                <input
                type="text"
                name="username"
                placeholder="Username"
                value={userData.username}
                onChange={handleChange}
                />
                <br/>
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                />
                <br/>
                <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
                />
                <br/>
                <button className='form-button' type="submit">Register</button>
                </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
}

export default Register;
