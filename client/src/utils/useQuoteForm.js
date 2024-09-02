import { useState } from "react";
import QuoteForm from "../components/QuoteForm";

const useQuoteForm = (initialState, user, toast) => {
  const [input, setInput] = useState(initialState);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { value, name } = e.target;
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

  const payload = {
    user_id: user.id,
    name: input.name,
    phone_number: input.phone_number,
    price: input.price,
    event_date: input.event_date,
    description: input.description,
    address: input.address,
  };

  try {
    const response = await fetch("http://127.0.0.1:5555/quotes", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      setError(errorMessage || "An error occurred, please try again later.");
      toast({
        title: "Error",
        description:
          errorMessage || "An error occurred, please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      setSuccess("Post Created Successfully");
      setInput({
        name: "",
        description: "",
        price: "",
        event_date: "",
        address: "",
        phone_number: "",
      });

      toast({
        title: "Post Created!",
        description: "Quote created successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  } catch (error) {
    setError("An error occurred. Try again later.");
    toast({
      title: "Error",
      description: "An error occurred. Try again later.",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
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
    success,
    input,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useQuoteForm;
