// @ts-nocheck
import api from "../api";

/**
 * Admin Login
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await api.post("/admin/login", {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    // ❌ DO NOT THROW
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Invalid credentials",
      };
    }

    return {
      success: false,
      message: "Server error",
    };
  }
};

/**
 * Supervisor Login
 */
export const supervisorLogin = async (username, password) => {
  try {
    const response = await api.post("/supervisors/loginsupervisor", {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    // ❌ DO NOT THROW
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Invalid credentials",
      };
    }

    return {
      success: false,
      message: "Server error",
    };
  }
};
