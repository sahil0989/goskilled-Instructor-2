import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import AddNewCourse from "./pages/instructor/add-new-course";
import { InstructorProvider } from "./context/instructor-context/InstructorContext";
import AddOrEditBlog from "./components/blogs section/UpdateBlog";
import AddOrEditMeeting from "./components/meeting/updataMeeting";

function App() {
  return (
    <AuthProvider>
      <InstructorProvider>

        <BrowserRouter>
          <Navbar />
          <Toaster richColors position="bottom-right" />
          <div className="h-20 w-full"></div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route path="/create-new-course" element={<AddNewCourse />} />
            <Route path="/instructor/edit-course/:courseId" element={<AddNewCourse />} />

            <Route path="/admin/blogs/new" element={<AddOrEditBlog />} />
            <Route path="/admin/blogs/edit/:id" element={<AddOrEditBlog />} />
          
            <Route path="/admin/meetings/new" element={<AddOrEditMeeting />} />
            <Route path="/admin/meetings/edit/:id" element={<AddOrEditMeeting />} />
          
          </Routes>
        </BrowserRouter>
      </InstructorProvider>
    </AuthProvider>
  );
}

export default App;
