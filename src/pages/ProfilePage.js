import React from "react";
import { Settings, Upload, Flame, Zap, Award } from "lucide-react";
import { ethers } from "ethers";

export default function ProfilePage({ userInfo }) {
  return (
    <div className="min-h-screen min-w-full bg-gray-100 flex flex-col justify-center items-center">
      <div className="min-w-full  mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex-grow">
        {/* Header */}
        <div className="relative h-40 bg-green-500">
          <div className="absolute top-4 left-4 text-white text-xl font-semibold">
            12:39
          </div>
          <div className="absolute top-4 right-4 text-white">
            <Settings size={24} />
          </div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center">
              <div className="w-28 h-28 bg-brown-500 rounded-full flex items-center justify-center">
                <span className="text-4xl text-white font-bold">
                  {userInfo[0].charAt(0)} {/* İlk harf */}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-4 text-center">
          <h1 className="text-2xl font-bold">{userInfo[0].toString()}</h1>
          <p className="text-gray-500">
            Joined {new Date(Number(userInfo[1]) * 1000).toLocaleString()}{" "}
            {/* Eğer userInfo[1] bir timestamp ise */}
            {/* Timestamp dönüşümü */}
          </p>

          <div className="flex mt-4 space-x-2">
            <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              GIVE STAR
            </button>
            <button className="bg-gray-200 p-2 rounded-lg">
              <Upload size={20} />
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="px-4 mt-6">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <Flame size={24} className="text-gray-400 mb-2" />
              <p className="text-2xl font-bold">
                {ethers.formatEther(userInfo[2]).toString()}
              </p>
              <p className="text-sm text-gray-500">Total Purchases</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Zap size={24} className="text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{userInfo[3].toString()}</p>
              <p className="text-sm text-gray-500">Total XP</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Award size={24} className="text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">
                {(userInfo[4].length - 1).toString()}
              </p>
              <p className="text-sm text-gray-500">Purchased Courses</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Award size={24} className="text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">
                {(userInfo[5].length - 1).toString()}
              </p>
              <p className="text-sm text-gray-500">Completed Lessons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
