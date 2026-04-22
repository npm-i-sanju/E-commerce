import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const LogoutPage = () => {
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false)


  const handleLogout = async () => {
  setIsLogout(true)

  try {
    const token = localStorage.getItem("accessToken")
    await api.post("/logout",{},{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    console.error("Logout failed:", error);
  } finally{
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    navigate("/login")  // ✅ redirect after logout
  }


  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm text-center">

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline strokeLinecap="round" strokeLinejoin="round" points="16 17 21 12 16 7" />
            <line strokeLinecap="round" x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-slate-800 mb-1">Sign out</h2>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to sign out of your account?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            disabled={isLogout}
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLogout ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Signing out...
              </>
            ) : (
              "Yes, sign out"
            )}
          </button>

          <button
            onClick={() => navigate(-1)}
            disabled={isLogout}
            className="w-full py-2.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-5">
          You will be redirected to the login page.
        </p>
      </div>
    </div>

  );
};

export default LogoutPage;