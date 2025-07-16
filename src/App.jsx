import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import { InstructorProvider } from "./context/instructor-context/InstructorContext";
import AddOrEditBlog from "./components/blogs section/UpdateBlog";
import AddOrEditMeeting from "./components/meeting/updataMeeting";
import Course from "./components/courses/courses/Course";
import AdminUsersPage from "./components/instructor-view";
import InstructorCourses from "./components/courses";
import AdminPayments from "./components/PaymentComponent";
import BlogDashboard from "./components/blogs section/BlogDashboard";
import AdminWithdrawals from "./components/WalletWithdraw";
import MeetingDashboard from "./components/meeting/MeetingDashboard";
import AdminKYCPanel from "./components/AdminKYCDashboard";
import DashboardLayout from "./pages/Dashboard";
import Dashboard from "./components/Dashboard";
import StudentProgress from "./components/StudentProgress";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InstructorProvider>
          <Navbar />
          <Toaster richColors position="bottom-right" />
          <div className="h-20 w-full"></div>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Dashboard Layout with Nested Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<AdminUsersPage/>} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="blogs" element={<BlogDashboard />} />
              <Route path="wallet" element={<AdminWithdrawals />} />
              <Route path="meetings" element={<MeetingDashboard />} />
              <Route path="kyc" element={<AdminKYCPanel />} />
            </Route>

            {/* Other Pages */}
            <Route path="/student" element={<StudentProgress />} />
            <Route path="/add" element={<Course />} />
            <Route path="/create-new-course" element={<Course />} />
            <Route path="/instructor/edit-course/:courseId" element={<Course />} />
            <Route path="/admin/blogs/new" element={<AddOrEditBlog />} />
            <Route path="/admin/blogs/edit/:id" element={<AddOrEditBlog />} />
            <Route path="/admin/meetings/new" element={<AddOrEditMeeting />} />
            <Route path="/admin/meetings/edit/:id" element={<AddOrEditMeeting />} />
          </Routes>
        </InstructorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
