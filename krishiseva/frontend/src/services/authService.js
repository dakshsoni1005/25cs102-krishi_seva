import api from "./api";

export const authService = {
  login: async (identifier, password) => {
    if (!identifier || !password) {
      throw new Error("Mobile number or email and password are required.");
    }
    
    // Call backend endpoint with identifier (and mobileNumber/email for maximum API compatibility)
    const isEmail = identifier.includes("@");
    const payload = {
      identifier,
      password,
      ...(isEmail ? { email: identifier } : { mobileNumber: identifier })
    };

    const response = await api.post("/auth/login", payload);
    const { token, refreshToken, farmer } = response.data.data;

    // Cache session in storage
    localStorage.setItem("krishiseva_token", token);
    localStorage.setItem("krishiseva_refresh_token", refreshToken);
    localStorage.setItem("krishiseva_farmer", JSON.stringify(farmer));
    
    return {
      success: true,
      token,
      farmer
    };
  },

  register: async (farmerData) => {
    const response = await api.post("/auth/register", farmerData);
    const { token, refreshToken, farmer } = response.data.data;

    localStorage.setItem("krishiseva_token", token);
    localStorage.setItem("krishiseva_refresh_token", refreshToken);
    localStorage.setItem("krishiseva_farmer", JSON.stringify(farmer));

    return {
      success: true,
      token,
      farmer
    };
  },

  getCurrentFarmer: async () => {
    try {
      const response = await api.get("/auth/me");
      const { farmer } = response.data.data;
      localStorage.setItem("krishiseva_farmer", JSON.stringify(farmer));
      return farmer;
    } catch (err) {
      // Fallback cache read
      const cached = localStorage.getItem("krishiseva_farmer");
      if (cached) return JSON.parse(cached);
      throw err;
    }
  },

  updateProfile: async (updatedData) => {
    const response = await api.put("/farmers/profile", updatedData);
    const { profile } = response.data.data;
    
    // Map back to farmer object format expected by frontend
    const farmer = {
      userId: profile.userId,
      fullName: profile.fullName,
      mobileNumber: profile.phone,
      email: profile.email,
      state: profile.state,
      district: profile.district,
      taluka: profile.taluka,
      village: profile.village,
      farmSize: profile.farmSize,
      mainCrop: profile.mainCrop,
      irrigationType: profile.irrigationType,
      profileCompletion: profile.profileCompletion
    };

    localStorage.setItem("krishiseva_farmer", JSON.stringify(farmer));
    return farmer;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Ignore network failures on logout
    }
    localStorage.removeItem("krishiseva_token");
    localStorage.removeItem("krishiseva_refresh_token");
    localStorage.removeItem("krishiseva_farmer");
    return { success: true };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("krishiseva_token");
  }
};

export default authService;
