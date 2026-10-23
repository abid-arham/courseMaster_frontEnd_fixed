import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courses.api";
import CoursesFilters from "./CoursesFilters";
import CoursesGrid from "./CoursesGrid";
import CoursesPagination from "./CoursesPagination";

const LIMIT = 8;

export default function CoursesSection() {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // query states
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    // the search term actually in effect — committed on submit, so typing does
    // not refetch and the request always carries a matching page number
    const [appliedSearch, setAppliedSearch] = useState("");
    const [sort, setSort] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");

    // one effect is the single source of fetches; every input that affects the
    // query is a dependency, so there is exactly one request per change
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await getCourses({
                    page,
                    limit: LIMIT,
                    search: appliedSearch || undefined,
                    sort: sort || undefined,
                    category: category || undefined,
                    tags: tags || undefined,
                });

                if (cancelled) return;
                setCourses(res.data.courses || []);
                setTotalPages(res.data.totalPages || 1);
            } catch (err) {
                if (cancelled) return;
                console.error("Failed to load courses:", err);
                setError(err.response?.data?.message || "Failed to load courses");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [page, appliedSearch, sort, category, tags]);

    // changing a filter always returns to the first page, in the same update as
    // the filter itself — so no request is ever made with a stale page
    const applyFilter = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const onSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearch(search);
        setPage(1);
    };

    return (
        <div className="space-y-6">

            <CoursesFilters
                search={search} setSearch={setSearch}
                sort={sort} setSort={applyFilter(setSort)}
                category={category} setCategory={applyFilter(setCategory)}
                tags={tags} setTags={applyFilter(setTags)}
                onSearchSubmit={onSearchSubmit}
            />

            {/* states */}
            {loading && (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {error && (
                <div role="alert" className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && courses.length === 0 && (
                <div className="rounded-xl border border-primary/20 bg-base-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-primary">
                        No courses found
                    </h3>
                    <p className="mt-1 text-base-content/70">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}


            {!loading && !error && courses.length > 0 && (
                <>
                    <CoursesGrid courses={courses} />
                    {user?.role === "admin" && (
                        <div className="flex justify-center pt-4">
                            <Link
                                to="/admin/courses"
                                className="btn btn-primary btn-wide"
                            >
                                Manage Courses
                            </Link>
                        </div>
                    )}
                </>
            )}

            <CoursesPagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    );
}
