import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [roomId, setRoomId] = useState('');
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);


    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/home', { username: username }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const id = res.data.newRoom._id;
            localStorage.setItem('room-ID', id)
            navigate(`/editor/${id}/python`)
        } catch (err) {
            setError('Something went wrong. Please try again!');
        }
    };

    const handleSubmitJoin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:4000/home/join`, { roomId: roomId }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const id = res.data.room._id
            localStorage.setItem('room-ID', id)
            navigate(`/editor/${id}/python`)
        } catch (err) {
            setError('Something went wrong. Please try again!');
        }
    };

    return (
        <div>
            <h2>Welcome, {username}</h2>
            <form onSubmit={handleSubmitJoin}>
                Room ID: 
                <br />
                <input id='room-id' value={roomId} onChange={(e) => setRoomId(e.target.value)} /> 
                <br />
                <button type="submit">Join Room</button>
            </form>
            <br />
            <button onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
            }}>Sign Out</button>
            <br />
            <form onSubmit={handleSubmitCreate}>
                <button type="submit">Create New Room</button>
            </form>
            <p>{error}</p>
        </div>
    );
}

export default Home;
