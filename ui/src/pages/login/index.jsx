import { useState, useEffect } from 'react';
import Styles from './assets/login.module.css';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { call } from '../../utility/api';
import { room_action } from '../../store/reducers/roomSlice';

export default function Login() {
    const [creds, setCreds] = useState({ username: "", password: "" });
    let navigate = useNavigate();
    let dispatch = useDispatch();

    async function validate_and_navigate() {
        let result = await call("POST", "http://localhost:3000/login", {}, { email: creds.username, password: creds.password });
        if (result["statusCode"] === 200) {
            localStorage.setItem('token', result["data"]);
            dispatch(room_action.saveLoginData(result["data"]));
            navigate("/room")
        } else {
            alert("Invalid Credentials");
        }
    }

    return (
        <div className={`${Styles.mainContainer}`}>
            <div className={`${Styles.pageContainer}`}>
                <div className={`${Styles.imageContainer}`} />
                <div className={`${Styles.loginContainer}`}>
                    <div className={`${Styles.heading}`}>Odoo Meeting Management Portal</div>
                    <div className={`${Styles.creds}`}>
                        <div>
                            <TextField
                                className={`${Styles.extend}`}
                                label="Email"
                                variant='outlined'
                                value={creds.username}
                                onChange={(e) => { setCreds({ ...creds, username: e.target.value }) }}
                            />
                        </div>
                        <div>
                            <TextField
                                className={`${Styles.extend}`}
                                type='password'
                                label="Password"
                                value={creds.password}
                                variant='outlined'
                                onChange={(e) => { setCreds({ ...creds, password: e.target.value }) }}
                            />
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={validate_and_navigate}
                                className={`${Styles.loginButton}`}>
                                Login
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
