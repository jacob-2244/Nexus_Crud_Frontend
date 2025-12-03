'use client'
import React from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const router=useRouter()

    function handleAdd(){
        router.push("/users/create")

    }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>

  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Total Users</h3>
          <p className="text-3xl font-bold  text-black">128</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Active Sessions</h3>
          <p className="text-3xl font-bold text-black ">45</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-black">New Registrations</h3>
          <p className="text-3xl font-bold text-black ">12</p>
        </div>
      </div>


      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Quick Actions</h3>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"    onClick={handleAdd}>
            Add New User
          </button>
        
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition hover:cursor-pointer">
            Delete Inactive
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
