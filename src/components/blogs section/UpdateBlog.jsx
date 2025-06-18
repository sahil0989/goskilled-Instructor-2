import React, { Fragment, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { createBlog, updateBlog, getBlogById } from "./blogService";
import { toast } from "sonner";
import {
    mediaUploadService,
    mediaPhotoDeleteService,
} from "../../services";

import MediaProgressbar from "../media-progress-bar/media-progress";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";

const AddOrEditBlog = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
    const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
    const fileInputRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalImageUrl, setModalImageUrl] = useState("")

    const [form, setForm] = useState({
        title: "",
        content: "",
        author: "",
        image: null,
        imagePublicId: null,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            (async () => {
                try {
                    const res = await getBlogById(id);
                    const { title, content, author, image, imagePublicId } = res.data.data;
                    setForm({ title, content, author, image, imagePublicId });
                } catch (err) {
                    toast.error("Failed to load blog data");
                }
            })();
        }
    }, [id, isEdit]);

    const openModal = (url) => {
        setModalImageUrl(url)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setModalImageUrl("")
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUploadChange = async (event) => {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append("file", selectedImage);

            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(
                    imageFormData,
                    setMediaUploadProgressPercentage
                );
                if (response.success) {
                    setForm((prev) => ({
                        ...prev,
                        image: response?.data?.url,
                        imagePublicId: response?.data?.public_id,
                    }));
                    console.log("Image Data: ", response.data);
                    toast.success("Image uploaded successfully!");
                } else {
                    toast.error("Upload failed.");
                }
            } catch (err) {
                toast.error("Image upload failed.");
            } finally {
                setMediaUploadProgress(false);
            }
        }
    };

    const handleReplaceImage = async () => {
        if (form.imagePublicId) {
            const deleteRes = await mediaPhotoDeleteService(form.imagePublicId);
            if (deleteRes.success) {
                setForm((prev) => ({
                    ...prev,
                    image: "",
                    imagePublicId: "",
                }));
                fileInputRef.current?.click();
            }
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.content || !form.author) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                title: form.title,
                content: form.content,
                author: form.author,
                image: form.image,
                imagePublicId: form.imagePublicId,
            };

            if (isEdit) {
                await updateBlog(id, payload);
                toast.success("Blog updated successfully!");
            } else {
                await createBlog(payload);
                toast.success("Blog created successfully!");
            }

            navigate("/dashboard", { state: { tab: "blogs" } });
        } catch (err) {
            toast.error("Failed to save blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? "Edit Blog" : "Add New Blog"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="Blog Title"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Content</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        required
                        placeholder="Blog Content"
                        rows={6}
                        className="w-full p-2 border rounded resize-y"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Author</label>
                    <input
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        placeholder="Author Name"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block mb-1 font-medium">Upload Image</label>

                    {mediaUploadProgress && (
                        <MediaProgressbar
                            isMediaUploading={mediaUploadProgress}
                            progress={mediaUploadProgressPercentage}
                        />
                    )}

                    {form.image ? (
                        <div className="flex gap-4">
                            <Button type="button" variant="link" onClick={() => openModal(form?.image)}>View Document</Button>
                            <Button onClick={handleReplaceImage} type="button" className="w-fit">
                                Replace Image
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Input
                                ref={fileInputRef}
                                onChange={handleImageUploadChange}
                                type="file"
                                accept="image/*"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-start gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard", { state: { tab: "blogs" } })}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-medium ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
                    </button>
                </div>
            </form>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
                                        Uploaded Document
                                    </Dialog.Title>
                                    {modalImageUrl.endsWith('.pdf') ? (
                                        <iframe src={modalImageUrl} title="PDF Document" className="w-full h-[500px]" />
                                    ) : (
                                        <img src={modalImageUrl} alt="Uploaded document" className="w-full max-h-[500px] object-contain" />
                                    )}
                                    <div className="mt-4">
                                        <Button onClick={closeModal}>Close</Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default AddOrEditBlog;
