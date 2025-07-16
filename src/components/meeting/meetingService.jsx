import axios from "axios";

const handleApiError = (error) => {
    if (error.response) {
        console.error("API Response Error:", error.response);
        return {
            success: false,
            message: error.response.data?.message || "Server responded with an error",
        };
    } else if (error.request) {
        console.error("No Response Error:", error.request);
        return {
            success: false,
            message: "No response from server. Please check your network.",
        };
    } else {
        console.error("General Error:", error.message);
        return {
            success: false,
            message: "An unexpected error occurred: " + error.message,
        };
    }
};

// ✅ Get all meetings
export const getMeetings = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings`);
        return { success: true, data: res.data };   
    } catch (error) {
        return handleApiError(error);
    }
};

export const getParticipantsData = async (id) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings/${id}/registrations`);
        return { success: true, data: res.data };   
    } catch (error) {
        return handleApiError(error);
    }
};

// ✅ Get a single meeting by ID
export const getMeetingById = async (id) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings/${id}`);
        return { success: true, data: res.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// ✅ Create a new meeting
export const createMeeting = async (meetingData) => {
    try {
        console.log("Meeting Data: ", meetingData);
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings`, meetingData);
        return { success: true, data: res.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// ✅ Update an existing meeting
export const updateMeeting = async (id, updatedData) => {
    try {
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings/${id}`, updatedData);
        return { success: true, data: res.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// ✅ Delete a meeting
export const deleteMeeting = async (id) => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/meetings/${id}`);
        return { success: true, data: res.data };
    } catch (error) {
        return handleApiError(error);
    }
};
