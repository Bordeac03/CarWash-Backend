import { React, useState, useContext } from 'react';
import { authInstance } from '../util/instances';
import { UserContext } from '../util/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fullName, setFullName] = useState('');
    const [register, setRegister] = useState(false);
    const context = useContext(UserContext);

  return (
    <div className='main'>
        <div className="login-wrapper">
            <h1>{register ? "Register" : "Login"}</h1>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            {register && <>
                    <label>Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}></input>
                </>
            }
            <button onClick={() => {
                if (register) {
                    authInstance().post('/register', { email, password, fullName }).then((res) => {
                        if (res.data.error) {
                            setError(res.data.error);
                        } else {
                            setError('');
                            setRegister(false);
                            context.setLoggedIn(true);
                        }
                    });
                } else {
                    authInstance().post('/login', { email, password }).then((res) => {
                        if (res.data.error) {
                            setError(res.data.error);
                        } else {
                            setError('');
                            context.setLoggedIn(true);
                        }
                    });
                }
            }}>Submit</button>
            <button onClick={() => setRegister(!register)}>{register ? "Login" : "Register"}</button>
            {error && <p>{error}</p>}
        </div>
    </div>
  )
}

export default Login