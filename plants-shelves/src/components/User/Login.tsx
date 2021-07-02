import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(login && password) {
      //TODO login code there, check https://django-graphql-auth.readthedocs.io/en/latest/quickstart/
    }
  }

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      autoComplete="off"
    >
      <FormGroup>
        <Label for="login">Login:</Label>
        <Input type="text" name="login" id="login" placeholder="Enter login"
          value={login}
          onChange={handleLoginInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password:</Label>
        <Input type="password" name="password" id="password" placeholder="Enter password"
          value={password}
          onChange={handlePasswordInputChange}
        />
      </FormGroup>
      <Button type="submit">Login</Button>
    </Form>
  )
}

export default Login
