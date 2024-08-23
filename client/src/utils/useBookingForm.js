import { useState } from "react";

const useBookingForm = (initialState, toast, user) => {
  const [input, setInput] = useState(initialState);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("event_date", input.event_date);
    formData.append("event_type", input.event_type);
    formData.append("guest_count", input.guest_count);
    formData.append("special_requests", input.special_requests);

     


    try {
      const response = await fetch("http://127.0.0.1:5555/bookings", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        setError(
          errorMessage.error || "An error occured,please try again later"
        );
      } else {
        setSuccess("Quote created successfully ");
        setInput({
          event_date: "",
          event_type: "",
          guest_count: "",
          user_id: user.id,
          special_requests: "",
        });
      }
      showToast();
    } catch (error) {
      setError("An error occured.Try again later");
    } finally {
      setIsloading(false);
    }
  };
  const showToast = () => {
    toast({
      title: "Post Created!",
      description: "Quote created successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  return {
    isLoading,
    error,
    input,
    success,
    handleChange,
    handleSubmit,
  };
};
export default useBookingForm;
