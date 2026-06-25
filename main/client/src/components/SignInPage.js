import React from 'react';
import './SignInPage.css';

export default function Main() {
    return (
        <div className='main-container'>
            <div className='pic'>
                <div className='section'>
                    <div className='section-2'>
                        <span className='text'>WELCOME BACK</span>
                        <span className='text-2'>Log In to your Account</span>
                    </div>
                    <div className='section-3'>
                        <div className='section-4'>
                            <div className='section-5'>
                                <div className='section-6'>
                                    <span className='text-3'>Email</span>
                                    <div className='box' />
                                </div>
                                <div className='box-2' />
                                <span className='text-4'>clayborne@yeounjun.com</span>
                            </div>
                            <div className='wrapper'>
                                <div className='box-3'>
                                    <span className='text-5'>Password</span>
                                    <div className='wrapper-2' />
                                </div>
                                <div className='section-7' />
                                <span className='text-6'>***************</span>
                                <div className='box-4'>
                                    <div className='img' />
                                </div>
                            </div>
                        </div>
                        <div className='section-8'>
                            <div className='box-5'>
                                <span className='text-7'>Remember me</span>
                                <input className='pic-2' type='checkbox'/>
                            </div>
                            <span className='text-8'>Forgot Password?</span>
                        </div>
                        <div className='group'>
                            <div className='group-2'>
                                <span className='text-9'>CONTINUE</span>
                            </div>
                        </div>
                    </div>
                    <div className='group-3'>
                        <span className='text-a'>Or</span>
                        <hr className='pic-3' />
                    </div>
                    <div className='box-6'>
                        <div className='group-4'>
                            <div className='box-7' />
                            <span className='text-b'>Log In with Google</span>
                            <div className='img-2' />
                        </div>
                        <div className='wrapper-3'>
                            <div className='box-8' />
                            <span className='text-c'>Log In with Facebook</span>
                            <div className='img-3' />
                        </div>
                        <div className='section-9'>
                            <div className='section-a' />
                            <span className='text-d'>Log In with Apple</span>
                            <div className='pic-4' />
                        </div>
                    </div>
                    <div className='wrapper-4'>
                        <span className='text-e'>New User?</span>
                        <span className='text-f'>SIGN UP HERE</span>
                    </div>
                </div>
            </div>
            <div className='group-5'>
                <div className='section-b'>
                    <span className='text-10'>"AI travel</span>
                    <span className='text-11'>
                        
                        planner for a unique and unprecedented journey."
                    </span>
                </div>
                <span className='text-12'>
                    Turn your long-debated travel plans into a schedule within minutes
                    with Globird.
                </span>
            </div>
        </div>
    );
}