import React, { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListAllUser } from './store/authSlice';

const ListUser = () => {
    const dispatch = useDispatch();
    const { userList } = useSelector((state) => state.auth);
    console.log("Userlist ", userList)

    useEffect(() => {
        dispatch(ListAllUser());
    }, [dispatch]);

    const handleConfirm = (userId) => {
        console.log("Confirm friend:", userId);
        // Add your confirm friend logic here (API call)
    };

    const handleDelete = (userId) => {
        console.log("Delete friend request:", userId);
        // Add your delete friend request logic here (API call)
    };

    return (
        <div className="max-w-3xl mx-auto mt-6">
            <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
            {userList.data && userList.data.length > 0 ? (
                <div className="space-y-4">
                    {userList.data.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg"
                        >
                            {/* User Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl text-gray-700">
                                    {user.username[0]}
                                </div>
                                <div>
                                    <h3 className="font-medium">{user.username}</h3>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleConfirm(user._id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No friend requests available.</p>
            )}
        </div>
    );
};

export default ListUser;
