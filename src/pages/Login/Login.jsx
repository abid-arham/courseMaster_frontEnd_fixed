import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginAsync, clearError } from "../../store/slices/authSlice";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    // don't carry a previous attempt's error into a fresh visit
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // the thunk stores the token and updates auth state, so no page reload
        // is needed to make the rest of the app notice the login
        const result = await dispatch(loginAsync(form));
        if (loginAsync.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <div className="card bg-base-100/90 backdrop-blur border border-base-300 shadow-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="card-body p-6 sm:p-10 relative z-10">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> Welcome Back
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            <span className="gradient-text">Sign In to CourseMaster</span>
                        </h1>
                        <p className="text-sm text-base-content/70 mt-2">
                            Enter your credentials to access your courses &amp; dashboard
                        </p>
                    </div>

                    {error && (
                        <div role="alert" className="alert alert-error shadow-md text-sm p-3 mb-4 rounded-xl flex items-center gap-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label" htmlFor="email">
                                <span className="label-text font-semibold flex items-center gap-1.5">
                                    <Mail className="w-4 h-4 text-primary" /> Email Address
                                </span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text font-semibold flex items-center gap-1.5">
                                    <Lock className="w-4 h-4 text-primary" /> Password
                                </span>
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input input-bordered w-full focus:input-primary pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-base-content/50 hover:text-base-content"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn btn-primary w-full btn-lg shadow-lg hover:shadow-xl mt-6 gap-2 font-bold"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-md"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" /> Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-4 border-t border-base-300">
                        <p className="text-sm text-base-content/70">
                            Don't have an account?{" "}
                            <Link className="link link-primary font-bold ml-1" to="/register">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
