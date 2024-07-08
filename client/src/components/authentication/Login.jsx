import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: ""
  };

  const loginSchema = yup.object().shape({
    email: yup.string().required('This field is required').email('Please enter a valid email address'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
  });

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const response = await login({
        email: values.email,
        password: values.password,
      });
      const { access_token, username, role, content } = response.data;
      localStorage.setItem('access', access_token);
      localStorage.setItem('username', username);
      dispatch(setCredentials({ accessToken: access_token, username: username, role: role, user: content }));
      toast({
        title: `Welcome back ${username}`,
        position: "top-center",
        status: "info",
        isClosable: true,
      });
      // navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <h1 className='text-center text-3xl font-bold'>Login to Masterly Caterers</h1>
          <div className='relative block mt-6 p-4 w-full'>
            <label className='absolute -top-2'>Email<span className='text-gold-600'>*</span></label>
            <Field type="email" name="email" placeholder="Email" className="w-96 p-2 text-black rounded-md border-gray-700 border" />
            <ErrorMessage name="email" component="div" className="text-red-600" />
          </div>

          <div className='relative block mt-6 p-4 w-full'>
            <label className='absolute -top-2 left-2'>Password <span className='text-gold-600'>*</span></label>
            <Field type={showPassword ? "text" : "password"} className='w-96 reative text-black rounded-md p-2 border-gray-700 border' name='password' placeholder='Password' />
            <ErrorMessage name="password" component="div" className="text-red-600" />
            <button className='absolute right-5 top-5' type="button" onClick={handleToggle}>
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </button>
          </div>

          <div className="block w-full mt-4 relative p-4">
            <button className="bg-rose-600 py-3 w-96 text-center text-white rounded-md" type="submit" disabled={isSubmitting || isLoading}>
              {isLoading ? <Spinner /> : 'Login'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Login;