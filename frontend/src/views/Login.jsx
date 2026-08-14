import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button, Card, Input, Toast } from "../components/common";
import { KeyRound, Smartphone, ShieldCheck } from "lucide-react";

export const Login = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  
  // Multi-mode auth layouts
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMobile, setForgotMobile] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      setToast({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }
    if (!password) {
      setToast({ type: "error", message: "Password is required." });
      return;
    }

    setLoading(true);
    try {
      await loginUser(mobileNumber, password);
      setToast({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      setToast({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setToast({ type: "success", message: "Mock OTP code '1234' sent successfully!" });
    }, 800);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode !== "1234") {
      setToast({ type: "error", message: "Invalid OTP code. Use code '1234' for demo." });
      return;
    }
    setLoading(true);
    try {
      await loginUser(mobileNumber, "mock-password-123");
      setToast({ type: "success", message: "OTP Verified! Redirecting..." });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotMobile.length !== 10) {
      setToast({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ type: "success", message: "Reset password SMS code sent to your registered mobile!" });
      setShowForgot(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-warm flex items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col gap-6">
        
        {/* Title Logo */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-black tracking-tight text-primary-800 flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full bg-accent-500 inline-block animate-pulse" />
            KRISHISEVA
          </Link>
          <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mt-2">
            Unified Smart Farming Platform
          </p>
        </div>

        {/* Card container */}
        <Card className="shadow-md border border-border-soft p-6 md:p-8 bg-white">
          {!showForgot ? (
            <>
              <div className="flex items-center justify-between border-b border-border-soft pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => { setIsOtpMode(false); setOtpSent(false); }}
                  className={`pb-1 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                    !isOtpMode ? "border-primary-800 text-primary-800" : "border-transparent text-text-muted"
                  }`}
                >
                  Password Login
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsOtpMode(true)}
                  className={`pb-1 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                    isOtpMode ? "border-primary-800 text-primary-800" : "border-transparent text-text-muted"
                  }`}
                >
                  OTP Login (Demo)
                </button>
              </div>

              {/* PASSWORD LOGIN FORM */}
              {!isOtpMode ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <Input
                    label="Registered Mobile Number"
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      id="password"
                      type="password"
                      placeholder="Enter account password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="absolute right-0 top-0 text-xs font-semibold text-primary-800 hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={loading}
                    icon={KeyRound}
                  >
                    {loading ? "Logging in..." : "Secure Login"}
                  </Button>
                </form>
              ) : (
                /* OTP LOGIN FORM & VERIFICATION */
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <Input
                        label="Mobile Number"
                        id="mobileOtpNumber"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        required
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      />
                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={loading}
                        icon={Smartphone}
                      >
                        {loading ? "Sending..." : "Request 4-Digit OTP"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="bg-primary-50 text-primary-800 text-xs font-semibold p-3 rounded-lg border border-primary-100 mb-2">
                        Verification Code sent to <b>{mobileNumber}</b>. Enter code <b>1234</b> to verify.
                      </div>
                      
                      <Input
                        label="Enter OTP Verification Code"
                        id="otpCode"
                        type="text"
                        maxLength={4}
                        placeholder="Enter 4-digit code"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      />
                      
                      <div className="flex items-center justify-between text-xs font-medium text-text-muted mt-1">
                        <span>Didn't receive code?</span>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-primary-800 font-bold hover:underline cursor-pointer"
                        >
                          Request New Code
                        </button>
                      </div>

                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={loading}
                        icon={ShieldCheck}
                      >
                        {loading ? "Verifying..." : "Verify & Login"}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </>
          ) : (
            /* FORGOT PASSWORD FORM */
            <form onSubmit={handleForgotSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="font-bold text-lg text-text-dark border-b border-border-soft pb-2.5">
                Reset Account Password
              </h3>
              
              <p className="text-xs text-text-muted leading-relaxed font-semibold">
                Enter your registered mobile number below. We will send you an OTP link to configure a new account password.
              </p>
              
              <Input
                label="Registered Mobile Number"
                id="forgotMobile"
                type="tel"
                placeholder="Enter 10-digit number"
                required
                maxLength={10}
                value={forgotMobile}
                onChange={(e) => setForgotMobile(e.target.value.replace(/\D/g, ""))}
              />

              <div className="flex gap-2.5 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForgot(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Reset"}
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Footer Prompt */}
        <div className="text-center text-xs font-semibold text-text-muted">
          Don't have a farming account?{" "}
          <Link to="/register" className="text-primary-800 hover:underline">
            Register your Farm
          </Link>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
export default Login;
