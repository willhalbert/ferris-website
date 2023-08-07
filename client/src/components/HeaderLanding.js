import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Dropdown,
  Modal,
} from "react-bootstrap";
import Logo from "../images/logo.png";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import "./HeaderLanding.css";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";

import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getDatabase } from "firebase/database";

export default function Header() {
  const Navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const { logout } = useAuth();
  async function handleLogout() {
    try {
      await logout();
      Navigate("/");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      {" "}
      {showLoginModal && (
        <Login
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          showSignupModal={showSignupModal}
          setShowSignupModal={setShowSignupModal}
        />
      )}
      {showSignupModal && (
        <Signup
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          showSignupModal={showSignupModal}
          setShowSignupModal={setShowSignupModal}
        />
      )}
      <Navbar
        fixed="top"
        expand="lg"
        className="navbar-custom"
        style={{
          fontSize: "16px",
          backdropFilter: "blur(10px)",
          opacity: ".98",
          height: "84px",
          backgroundColor: "white !important",
        }}
      >
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <img src={Logo} style={{ height: "68px" }} alt="Logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <div className="desktop" style={{ marginRight: "18px" }}>
                <div className="container d-flex" style={{ gap: "24px" }}>
                  {user ? (
                    <Nav.Link href="chat">Chat</Nav.Link>
                  ) : (
                    <Nav.Link href="pricing">Pricing</Nav.Link>
                  )}
                </div>
              </div>

              <div className="mobile" style={{ background: "white" }}>
                {!user && (
                  <>
                    <Nav.Link
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowSignupModal(false);
                      }}
                      style={{ padding: "10px 24px" }}
                    >
                      Log In
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                      }}
                      style={{ padding: "10px 24px" }}
                    >
                      Sign Up
                    </Nav.Link>
                    <Nav.Link href="pricing" style={{ padding: "10px 24px" }}>
                      Pricing
                    </Nav.Link>
                  </>
                )}
                {user && (
                  <>
                    <Nav.Link
                      href="my-credits"
                      style={{ padding: "10px 24px" }}
                    >
                      Chat
                    </Nav.Link>
                    <Nav.Link
                      href="my-credits"
                      style={{ padding: "10px 24px" }}
                    >
                      My Credits
                    </Nav.Link>
                    <Nav.Link href="pricing" style={{ padding: "10px 24px" }}>
                      Pricing
                    </Nav.Link>
                    <Nav.Link href="logout" style={{ padding: "10px 24px" }}>
                      Log Out
                    </Nav.Link>
                  </>
                )}
              </div>
            </Nav>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {
                  <MenuRoundedIcon
                    style={{ fill: "black" }}
                    sx={{ fontSize: 30 }}
                  />
                }
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  left: "100%",
                  transform: "translateX(-100%)",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                {!user && (
                  <>
                    <Dropdown.Item
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowSignupModal(false);
                      }}
                    >
                      Log In
                    </Dropdown.Item>
                  </>
                )}
                {!user && (
                  <>
                    <Dropdown.Item
                      onClick={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                      }}
                    >
                      Sign Up
                    </Dropdown.Item>
                  </>
                )}
                {user && (
                  <>
                    <Dropdown.Item href="my-credits">My Credits</Dropdown.Item>
                    <Dropdown.Item href="pricing">Pricing</Dropdown.Item>
                    <Dropdown.Item
                      style={{
                        color: "black",
                        textDecoration: "none",
                      }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

function Login(props) {
  const {
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal,
  } = props;
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setShowLoginModal(false);
    } catch (err) {
      console.log(err);
      setError("Failed to log in.");
    }
    setLoading(false);
  }
  return (
    <>
      <Modal
        show={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
          setShowSignupModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div
            className="w-100 text-center mt-2"
            onClick={() => {
              setShowLoginModal(false);
              setShowSignupModal(true);
            }}
            style={{ cursor: "pointer" }}
          >
            Need an account? <Link>Sign Up</Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function Signup(props) {
  const {
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal,
  } = props;
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      return setError("Passwords do not match.");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      setShowSignupModal(false);
    } catch (err) {
      console.log(err);
      setError("Failed to set up an account.");
    }
    setLoading(false);
  }

  return (
    <>
      <Modal
        show={showSignupModal}
        onHide={() => {
          setShowLoginModal(false);
          setShowSignupModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignUp}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirmation">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmationRef}
                required
              />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Sign Up
            </Button>
          </Form>

          <div
            className="w-100 text-center mt-2"
            onClick={() => {
              setShowLoginModal(true);
              setShowSignupModal(false);
            }}
            style={{ cursor: "pointer" }}
          >
            Already have an account? <Link>Log In</Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
