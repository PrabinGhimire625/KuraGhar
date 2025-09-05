import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile } from '../store/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { status, profile } = useSelector((state) => state.auth);
    console.log("status", status)

    useEffect(() => {
        dispatch(userProfile());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="flex justify-center py-20 bg-white">
                <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center py-20 bg-white">
                <p className="text-lg text-red-600 font-semibold">Failed to load profile.</p>
            </div>
        );
    }

    return (
        <div className="pt-16 px-4 md:px-8 max-w-screen-xl mx-auto">
            <div className="w-full px-4 md:px-8 py-10 bg-gradient-to-b from-white via-gray-50 to-white">
                <div className="bg-white shadow-2xl rounded-3xl max-w-3xl mx-auto p-6 md:p-10 border border-gray-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-800">👤 User Profile</h1>
                        <p className="text-gray-500 mt-1">Welcome back, {profile.username?.split(' ')[0]}!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-500">Name</label>
                            <p className="text-lg font-semibold text-gray-800">{profile.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500">Email</label>
                            <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
