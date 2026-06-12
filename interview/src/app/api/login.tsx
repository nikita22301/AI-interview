import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(
    "http://localhost:8080/api/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};