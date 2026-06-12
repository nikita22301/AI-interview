const BASE_URL = "http://localhost:8080/api/auth";

export const sendOtpApi = async (email: string) => {
  const response = await fetch(`${BASE_URL}/sendOtp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return await response.json();
};

export const verifyOtpApi = async (email: string, otp: string) => {
  const response = await fetch(`${BASE_URL}/verifyOtp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  return await response.json();
};

export const signupApi = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${BASE_URL}/signUp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  return await response.json();
};
export const forgotPassword = async (email: string, newPassword: string) => {
  const response = await fetch(`${BASE_URL}/forgotPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, newPassword }),
  });

  return await response.json();
};
export const deleteUserApi = async (email: string) => {
  const response = await fetch(`${BASE_URL}/deleteUser`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return await response.json();
};