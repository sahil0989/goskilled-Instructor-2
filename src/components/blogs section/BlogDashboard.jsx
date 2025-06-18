import { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "./blogService";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  console.log("Blogs: ", blogs)

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getBlogs();
      setBlogs(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this blog?")) {
      try {
        setDeletingId(id);
        await deleteBlog(id);
        toast.success("Blog deleted successfully");
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } catch (err) {
        toast.error("Failed to delete blog");
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Admin Panel</h1>
        <Link
          to="/admin/blogs/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + New Blog
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-500">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border border-gray-300 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={`${blog.image}`}
                alt="Blog Cover"
                className="h-40 w-full object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold line-clamp-2">{blog.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{blog.content}</p>
              <p className="text-xs mt-2 text-gray-500 italic">By {blog.author}</p>

              <div className="flex gap-3 mt-4">
                <Link
                  to={`/admin/blogs/edit/${blog._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  disabled={deletingId === blog._id}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  {deletingId === blog._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;
