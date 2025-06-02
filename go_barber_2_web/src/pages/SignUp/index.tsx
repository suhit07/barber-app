import * as React from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import getToastErrors from '../../utils/getToastErrors';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const signUpSchema = object().shape({
  name: string().required('Name is required'),
  email: string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: string().min(6, 'Minimum 6 characters'),
});

interface SignupDataForm {
  name: string;
  email: string;
  password: string;
}

function SignUp() {
  const { signUp } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const formRef = React.useRef<FormHandles>(null);

  const handleSignUpSubmit = React.useCallback(
    async (data: SignupDataForm) => {
      formRef.current?.setErrors({});

      try {
        await signUpSchema.validate(data, { abortEarly: false });
      } catch (err: any) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        const toastErrors = getToastErrors(err);
        toastErrors.forEach(toastError => {
          addToast(toastError);
        });
        return;
      }

      try {
        await signUp(data);

        formRef.current?.reset();
        addToast({
          title: `Successfully registered!`,
          description:
            'Congratulations, your account has been created. Please use your credentials to login',
          type: 'success',
        });

        navigate('/');
      } catch (err) {
        addToast({
          title: `Registration error`,
          description: 'Unable to create user, please check your information',
          type: 'error',
        });
      }
    },
    [addToast, signUp, navigate],
  );

  return (
    <Container>
      <Background />

      <Content>
        <img src={logo} alt="go barber logo" />
        <Form onSubmit={handleSignUpSubmit} ref={formRef}>
          <h1>Create your account</h1>
          <Input placeholder="Name" name="name" icon={FiUser} />
          <Input placeholder="Email" name="email" icon={FiMail} />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            icon={FiLock}
          />
          <Button type="submit">Register</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Back to login
        </Link>
      </Content>
    </Container>
  );
}

export default SignUp;
