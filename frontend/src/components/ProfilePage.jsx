import React, { useState, useRef, useEffect } from 'react';

const ProfilePage = () => {
  // 1. Initialize data from localStorage if it exists, otherwise use defaults
  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem('forever_profile_data');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 000-0000',
      address: '123 Fashion St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    };
  });

  // 2. Initialize image from localStorage
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('forever_profile_image') || null;
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Convert image to Base64 so it can be saved in localStorage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        // Save the image immediately when uploaded
        localStorage.setItem('forever_profile_image', base64String);
      };
      reader.readAsDataURL(file); // This converts the file to a saveable string
    }
  };

  const handleEditPictureClick = () => {
    fileInputRef.current.click();
  };

  // 4. Save text data to localStorage when clicking "Save Changes"
  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem('forever_profile_data', JSON.stringify(profileData));
    console.log('Profile successfully saved to local storage!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optional: If they cancel, revert back to what is currently in localStorage
    const savedData = localStorage.getItem('forever_profile_data');
    if (savedData) {
      setProfileData(JSON.parse(savedData));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="font-prata text-4xl text-gray-900 mb-2">My Profile</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-0.5 w-10 bg-gray-800"></div>
            <p className="font-outfit text-sm uppercase tracking-widest text-gray-500">Account Settings</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gray-50/50 border-b border-gray-100 py-10 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-pink-50 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-pink-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <button 
                onClick={handleEditPictureClick}
                className="absolute bottom-1 right-1 bg-gray-900 text-white p-2 rounded-full hover:bg-pink-600 transition-colors shadow-lg cursor-pointer"
                type="button"
                title="Change profile picture"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <h2 className="mt-4 font-prata text-xl text-gray-800">{profileData.fullName || 'User Name'}</h2>
            <p className="font-outfit text-sm text-gray-400">{profileData.email}</p>
          </div>

          <div className="p-8 lg:p-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-prata text-lg text-gray-800">Details</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="font-outfit text-sm font-medium text-pink-600 hover:text-pink-700 underline underline-offset-4"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-1">
                <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                  placeholder="Email"
                />
              </div>

              <div className="space-y-1">
                <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                  placeholder="Phone"
                />
              </div>

              <div className="space-y-1">
                <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                  placeholder="Address"
                />
              </div>

              <div className="space-y-1">
                <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                  placeholder="City"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                    placeholder="State"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                    placeholder="ZIP"
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-outfit text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full font-outfit px-0 py-2 border-b border-gray-200 focus:border-pink-500 focus:outline-none bg-transparent transition-colors disabled:text-gray-600 disabled:bg-transparent disabled:border-gray-200"
                  placeholder="Country"
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSave}
                  className="bg-gray-900 text-white font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-pink-600 transition-colors flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white text-gray-500 border border-gray-200 font-outfit uppercase tracking-widest text-sm px-8 py-4 hover:bg-gray-50 transition-colors flex-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
