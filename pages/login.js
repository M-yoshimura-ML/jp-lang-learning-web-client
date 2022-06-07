import Layout from "../components/Layout";
import Image from 'next/image';
import { LockClosedIcon } from '@heroicons/react/solid';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'universal-cookie';
import { AuthContext } from "../context/AuthContext";
// import * as Cookie from 'universal-cookie';

const cookie = new Cookie();

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let {loginUser} = useContext(AuthContext);
    let {user} = useContext(AuthContext);

    if(user){
        router.push('/');
    }

    // const login = async () => {
    //     e.preventDefault();
    //     try {
    //         await fetch (
    //             // `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
    //             `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/login`,
    //             {
    //                 method: 'POST',
    //                 body: JSON.stringify({ email: email, password: password }, null, 2),
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 credentials: 'include',
    //             }
    //         )
    //         .then((res) => {
    //             if(res.status === 400) {
    //                 throw 'authentication failed';
    //             } else if (res.ok) {
    //                 return res.json();
    //             }
    //         })
    //         .then((data) => {
    //             // const options = { path: '/' };
    //             // cookie.set('access_token', data.access, options);
    //             // cookie.set('jwt', data.jwt, options);
    //             cookie.set('jwt', data.jwt);
    //             console.log(data);
    //             console.log(data.jwt);
    //             // router.push('/');
    //         });
    //     } catch (error) {
    //         alert(error);
    //     }
    // }

    
    return (
        <Layout title="login">
            <div className="max-w-md w-full space-y-8">
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}  
                    <img
                    className="mx-auto h-12 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white-900">
                        Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={loginUser}>
                    {/* <input type="hidden" name="remember" defaultValue="true" /> */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                            username
                            </label>
                            <input
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="username"
                                value={username}
                                onChange={ (e) => {setUsername(e.target.value)} }
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e)=> {setPassword(e.target.value)} }
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                            </span>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}