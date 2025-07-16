import React, { useEffect, useState, useCallback } from "react";
import { Delete, Edit } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useInstructor } from "../../context/instructor-context/InstructorContext";
import {
    courseCurriculumInitialFromData,
    courseLandingInitialFormData,
} from "../../config";
import { toast } from "sonner";
import { deleteParticularCourse } from "../../services";
import { useAuth } from "../../context/AuthContext";

function InstructorCourses() {
    const {
        setCurrentEditedCourseId,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
    } = useInstructor();

    const { fetchAdminAllCourses, courses } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [deletingCourseId, setDeletingCourseId] = useState(null);

    // Fetch all courses on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
            return;
        }

        async function loadCourses() {
            setLoading(true);
            try {
                await fetchAdminAllCourses();
            } catch (err) {
                toast.error("Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        }

        loadCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // Delete course handler
    const handleDeleteCourse = useCallback(
        async (id) => {
            if (!window.confirm("Are you sure you want to delete this course?")) return;

            setDeletingCourseId(id);

            try {
                const response = await deleteParticularCourse(id);
                if (response?.success) {
                    toast.success("Course deleted successfully");

                    setCurrentEditedCourseId(null);
                    setCourseLandingFormData(courseLandingInitialFormData);
                    setCourseCurriculumFormData(courseCurriculumInitialFromData);

                    await fetchAdminAllCourses();
                } else {
                    toast.error(response?.message || "Failed to delete course");
                }
            } catch (err) {
                toast.error("Internal Server Error");
            } finally {
                setDeletingCourseId(null);
            }
        },
        [
            fetchAdminAllCourses,
            setCourseCurriculumFormData,
            setCourseLandingFormData,
            setCurrentEditedCourseId,
        ]
    );

    // Navigate to create new course page
    const handleCreateNewCourse = () => {
        setCurrentEditedCourseId(null);
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFromData);
        navigate("/create-new-course");
    };

    // Navigate to edit course page
    const handleEditCourse = (id) => {
        setCurrentEditedCourseId(id);
        navigate(`/instructor/edit-course/${id}`);
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl sm:text-3xl font-extrabold">All Courses</CardTitle>
                <Button onClick={handleCreateNewCourse} className="w-full sm:w-auto px-6 py-2">
                    Create New Course
                </Button>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <Table className="min-w-full text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Skill Price</TableHead>
                                <TableHead>Carrer Price</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue (Standard Plan)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">
                                        Loading courses...
                                    </TableCell>
                                </TableRow>
                            ) : courses && courses.length > 0 ? (
                                courses.map((course) => (
                                    <TableRow key={course._id}>
                                        <TableCell className="font-medium">{course.title || "Untitled Course"}</TableCell>
                                        <TableCell>₹{course.pricing?.standard ?? 0}</TableCell>
                                        <TableCell>₹{course.pricing?.premium ?? 0}</TableCell>
                                        <TableCell>{course.students?.length ?? 0}</TableCell>
                                        <TableCell>
                                            ₹{(course.students?.length ?? 0) * (course.pricing?.standard ?? 0)}
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end space-x-2">
                                            <Button
                                                onClick={() => handleEditCourse(course._id)}
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Edit ${course.title || "course"}`}
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Button>

                                            <Button
                                                onClick={() => handleDeleteCourse(course._id)}
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Delete ${course.title || "course"}`}
                                                disabled={deletingCourseId === course._id}
                                            >
                                                <Delete className="h-5 w-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">
                                        No courses found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default InstructorCourses;
