import React, { useEffect } from "react";

import * as A from "./adminLogin";

import { UserOutlined, LockOutlined } from "@ant-design/icons";

import profile from "assets/images/profile1.png";
import logo from "assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { CheckAuthHook, LoginHook } from "hooks/adminHooks";
import useForm from "hooks/useForm";
import { useAppDispatch, useAppSelector } from "store/store";
import { setCredentials } from "store/redux/slices/adminSlices/loginSlices";
import { credentialsValidate } from "components/validator";
import { Loader } from "components/common";
import { resetcheckAuth } from "store/redux/slices/adminSlices/checkAuthSlice";

const AdminCom = () => {
  const { credentials, loading, errorMessage, error } = useAppSelector(
    (state) => state.login
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { login } = LoginHook();
  const { loading: authLoading, auth } = CheckAuthHook();

  const { handleSubmit, errors } = useForm(
    login,
    credentialsValidate,
    credentials
  );

  useEffect(() => {
    auth && dispatch(resetcheckAuth()) && navigate("/stories");
  }, [auth]);

  return (
    <div>
      <A.LoginMain>
        {
          authLoading? <Loader content="Loading..." />:
          <A.LoginContainer>
          {
            <>
              <A.LogoImg src={logo} />
              <A.LoginRow>
                <A.LoginCol lg={6} xs={11}>
                  <A.LoginProfileImg width={200} src={profile} />
                  <A.LoginForm name="normal_login" className="login-form">
                    <A.LoginForm.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Username!",
                        },
                      ]}
                    >
                      <A.InputValue
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Username"
                        value={credentials.username}
                        maxLength={8}
                        onChange={(e) =>
                          dispatch(
                            setCredentials({
                              ...credentials,
                              username: e.target.value,
                            })
                          )
                        }
                      />
                      {error && errorMessage.status === 404 && (
                        <p style={{ color: "red" }}>{errorMessage.error}</p>
                      )}
                      {errors.username && (
                        <p style={{ color: "red" }}>{errors.username}</p>
                      )}
                    </A.LoginForm.Item>
                    <A.LoginForm.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Password!",
                        },
                      ]}
                    >
                      <A.InputValue
                        type="password"
                        value={credentials.password}
                        maxLength={8}
                        onChange={(e) =>
                          dispatch(
                            setCredentials({
                              ...credentials,
                              password: e.target.value,
                            })
                          )
                        }
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        placeholder="Password"
                      />
                      {error && errorMessage.status === 401 && (
                        <p style={{ color: "red" }}>{errorMessage.error}</p>
                      )}
                      {errors.password && (
                        <p style={{ color: "red" }}>{errors.password}</p>
                      )}
                    </A.LoginForm.Item>
                    <A.LoginForm.Item>
                      <A.Checkboxs>Remember me</A.Checkboxs>
                      <a
                        className="text-end"
                        style={{ marginLeft: "11.2rem", color: "white" }}
                        href=""
                      >
                        Forgot password
                      </a>
                    </A.LoginForm.Item>
                    <A.LoginForm.Item>
                      <A.LoginButton
                        type="primary"
                        htmlType="submit"
                        onClick={handleSubmit}
                        disabled={loading ? true : false}
                        className="login-form-button"
                      >
                        {" "}
                        {loading ? "authenticating..." : "LOGIN"}
                      </A.LoginButton>
                    </A.LoginForm.Item>
                   
                  </A.LoginForm>
                </A.LoginCol>
              </A.LoginRow>
            </>
          }
        </A.LoginContainer>
        }
       
      </A.LoginMain>
    </div>
  );
};

export default AdminCom;
