import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/blogs`;

export const getBlogs = () => axios.get(API_BASE);

export const getBlogById = (id) => axios.get(`${API_BASE}/${id}`);

export const createBlog = (formData) => {
    console.log("DAta: ", formData)
    axios.post(API_BASE, formData)
};

export const updateBlog = (id, formData) => {
    axios.put(`${API_BASE}/${id}`, formData)
};

export const deleteBlog = (id) => axios.delete(`${API_BASE}/${id}`);
