import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/Authslice";
import { toast } from "react-toastify";
import { Text } from "@chakra-ui/react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { v4 as uuidv4 } from "uuid";

const LoginGoogle = () => {
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Login successful", response);
      const nonce = uuidv4(); // Generate a unique nonce
      const { access_token } = response; // Ensure you are using the correct field

      if (!access_token) {
        console.error("Access token is missing from the response.");
        toast({
          title: "Access token is missing from the response.",
          position: "top-center",
          status: "error",
          isClosable: true,
        });
        return;
      }

      console.log("Access token:", access_token); // Log the access token

      try {
        const res = await axios.post("http://127.0.0.1:5555/login/authorized", {
          token: access_token,
          nonce: nonce, // Include the nonce in the request
        });

        const { data } = res;
        const { access_token: backendAccessToken, refresh_token, user } = data;

        localStorage.setItem("access", backendAccessToken);
        localStorage.setItem("refresh", refresh_token);

        dispatch(setCredentials({ accessToken: backendAccessToken, user }));
        toast({
          title: `Welcome ${user.username}`,
          position: "top-center",
          status: "success",
          isClosable: true,
        });
      } catch (error) {
        console.error(
          "Error from server:",
          error.response ? error.response.data : error.message
        );
        toast({
          title: `An error occurred: ${
            error.response ? error.response.data.message : error.message
          }`,
          position: "top-center",
          status: "error",
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: `An error occurred: ${error}`,
        position: "top-center",
        status: "error",
        isClosable: true,
      });
      console.log("Login failed", error);
    },
  });

  return (
    <div className="block w-full mt-4 relative p-4">
      <button
        onClick={() => googleLogin()}
        className="py-3 flex justify-center w-96 text-center text-stone-900 border border-gray-700 rounded-md gap-2"
      >
        <FcGoogle fontSize={"1.3rem"} />
        <Text className="text-white">Sign in with Google</Text>
      </button>
    </div>
  );
};

const GoogleAuthProviderWrapper = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <LoginGoogle />
  </GoogleOAuthProvider>
);

export default GoogleAuthProviderWrapper;
