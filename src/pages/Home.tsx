import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/auth.service";

const Home = () => {
  const navigate = useNavigate();

  const [isValidated, setIsValidated] = useState(true);

  const handleLogin = async () => {
    const response = await login(formData.username, formData.password);
    if (response) {
      navigate("/chart");
    } else {
      setIsValidated(false);
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  return (
    <>
      <h1>Coloumb AI Assignment</h1>
      <div className="form d-flex-row">
        <div className="flex-grow-1 d-flex justify-content-center m-3">
          <div className="mx-2">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            ></input>
          </div>
        </div>
        <div className="flex-grow-1 d-flex justify-content-center m-3">
          <div className="mx-2">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>
        {!isValidated && (
          <div className="flex-grow-1 d-flex justify-content-center m-3">
            <div className="mx-2 text-danger">Check Username or password</div>
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary my-2"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="btn btn-danger m-2"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

export default Home;
