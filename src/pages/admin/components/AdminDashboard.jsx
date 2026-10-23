import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getMe } from "../../../services/auth.api";
import AdminRoute from "../../../routes/AdminRoute";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
    const [me, setMe] = useState(null);
    const [loadError, setLoadError] = useState(null);
    // bumping this re-runs the fetch effect (used by the Retry button)
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const loadMe = async () => {
            try {
                const res = await getMe();
                if (cancelled) return;
                setMe(res.data);
                setLoadError(null);
            } catch (err) {
                if (cancelled) return;
                console.error("Failed to load user:", err);
                // without an error state the whole /admin area rendered as a
                // blank page, because AdminRoute returns null while me is null
                setLoadError(
                    err.response?.data?.message || "Could not load your profile."
                );
            }
        };

        loadMe();
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    if (loadError) {
        return (
            <div role="alert" className="alert alert-error m-4">
                <span>{loadError}</span>
                <button
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="btn btn-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!me) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <AdminRoute me={me}>
            {/* full width override */}
            <div className="w-full max-w-none flex flex-col lg:flex-row min-h-[80vh]">

                {/* sidebar - hidden on mobile, shown via drawer */}
                <div className="hidden lg:block shrink-0">
                    <AdminSidebar />
                </div>

                {/* Mobile drawer toggle button */}
                <div className="lg:hidden">
                    <AdminSidebar />
                </div>

                {/* content area */}
                <main className="flex-1 p-2 sm:p-4 lg:p-5 bg-base-100 w-full">
                    <Outlet />
                </main>

            </div>
        </AdminRoute>
    );
}
