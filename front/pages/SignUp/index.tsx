import React, { ChangeEvent, useCallback, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from './styles';
import useInput from '@hooks/useinput';
import axios from 'axios';
import { sign } from 'crypto';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const SignUp = () => {
  const { data, error, isLoading, refetch, isFetching } = useQuery(['user'], () =>
    axios.get('http://localhost:3095/api/users', { withCredentials: true }).then((res) => res.data),
  );

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [missmatchError, setMissmatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMissmatchError(e.target.value !== checkPassword);
    },
    [checkPassword],
  );

  const onChangeCheckPassword = useCallback(
    (e) => {
      setCheckPassword(e.target.value);
      setMissmatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!missmatchError) {
        console.log('서버로 회원가입하기!');
        setSignUpError('');
        setSignUpSuccess(false);
        axios
          .post('http://localhost:3095/api/users', {
            email,
            nickname,
            password,
          })
          .then((res) => {
            console.log(res);
            setSignUpSuccess(true);
          })
          .catch((err) => {
            console.log(err.response);
            setSignUpError(err.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, checkPassword, missmatchError],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <Navigate to="/workspace/channel"></Navigate>;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
          <Label id="nickname-label">
            <span>닉네임</span>
            <div>
              <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
            </div>
          </Label>
          <Label id="password-label">
            <span>비밀번호</span>
            <div>
              <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
            </div>
          </Label>
          <Label id="password-check-label">
            <span>비밀번호 확인</span>
            <div>
              <Input
                type="password"
                id="password-check"
                name="password-check"
                value={checkPassword}
                onChange={onChangeCheckPassword}
              />
            </div>
          </Label>
          {missmatchError && <Error>비밀번호 일치하지 않음</Error>}
          {!nickname && <Error>닉네임을 입력해주세요</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입 성공!!</Success>}
          <Button type="submit">회원가입</Button>
        </Label>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
        {/* <a href="/login">로그인</a> */}
      </LinkContainer>
    </div>
  );
};

export default SignUp;
