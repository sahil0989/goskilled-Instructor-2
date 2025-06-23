import { toast } from "sonner";
import axiosInstance from "../api/axiosInstance.js";

// Fetch all withdrawal requests with populated user info
export async function fetchAllWithdrawals() {
  try {
    const { data } = await axiosInstance.get('/api/wallet/all');
    return data;
  } catch (error) {
    toast.error("Failed to fetch withdrawals");
    console.error(error);
  }
}

// Fetch full user KYC details by user ID
export async function fetchUserKYCService(userId) {
  try {
    const { data } = await axiosInstance.get(`/api/user/kyc/${userId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Update withdrawal status (approve/reject)
export async function updateWithdrawalStatus(withdrawalId, status) {
  try {
    const { data } = await axiosInstance.put(`/api/wallet/status/${withdrawalId}`, { status });
    toast.success("Withdrawal status updated");
    return data;
  } catch (error) {
    console.error(error);
  }
}

//new urls

export async function getUsersDashboard() {
  try {
    const { data } = await axiosInstance.get(`/admin/allUsers`);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// course api 
export async function fetchAllCourses() {
  try {
    const { data } = await axiosInstance.get(`/admin/courses/get`);

    return data;
  } catch (err) {
    toast.error("Internal Server Error : ", err.message);
  }
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/admin/courses/update/${id}`,
    formData
  );

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/admin/courses/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/admin/courses/get/details/${id}`
  );

  return data;
}


export async function deleteParticularCourse(id) {
  const { data } = await axiosInstance.delete(`/admin/courses/delete/${id}`);

  return data;
}
//old urls

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function mediaUploadService(formData, onProgressCallback = () => { }) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );

      if (typeof onProgressCallback === "function") {
        onProgressCallback(percentCompleted);
      }
    },
  });

  return data;
}


export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function mediaPhotoDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/photo/${id}`);

  return data;
}

export async function fetchingPaymentsDetails(params) {
  const { data } = await axiosInstance.get('/api/payment/requests', params)

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}
