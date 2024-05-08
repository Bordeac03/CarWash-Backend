import { React, useState, useContext } from 'react';
import { authInstance } from '../util/instances';
import { UserContext } from '../util/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const context = useContext(UserContext);

  return (
    <div className='main'>
        <div className="login-wrapper">
            <h1>Login</h1>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => {
                authInstance().post('/login', { email, password })
                .then((res) => {
                        if (res.data.error) {
                            setError(res.data.error);
                        } else {
                            setError('');
                            context.setLoggedIn(true);
                        }
                    })
                .catch((err) => console.log(err));
            }}>Submit</button>
            {error && <p>{error}</p>}
        </div>
    </div>
  )
}

export default Login