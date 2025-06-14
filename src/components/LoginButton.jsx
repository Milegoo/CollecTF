//import { useNavigate } from "react-router-dom";
//import "./Login.css";
const loginUrl = "https://collectf.vercel.app/api/auth/login"; // to be changed in prod: "https://collectf.vercel.app/api/auth/login"https://localhost:3000/api/auth/login
const logoutUrl = "https://collectf.vercel.app/api/auth/logout"; // to be changed in prod: "https://collectf.vercel.app/api/auth/logout"https://localhost:3000/api/auth/logout

function LoginButton({ userStatus, user, loading }) {

    return (
      <>
        {loading && <p>Loading...</p>}
        {(userStatus == 1 || userStatus == 2) && user && !loading && <b>{user}</b>}
        {userStatus == 0 && !loading &&
          <a className="text-accent no-underline hover:underline" href={loginUrl}>
            <button className="btn">Log In With GitHub</button>
          </a>
        }
        {(userStatus == 1 || userStatus == 2) && !loading &&
          <a className="text-accent no-underline hover:underline" href={logoutUrl}>
          <button className="btn">Log out</button>
          </a>
        }
      </>
    );
  }

export default LoginButton;