import { Delete, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useInstructor } from "../../context/instructor-context/InstructorContext";
import { courseCurriculumInitialFromData, courseLandingInitialFormData } from "../../config";
import { toast } from "sonner";
import { deleteParticularCourse } from "../../services";
import { useAuth } from "../../context/AuthContext";

function InstructorCourses({ listOfCourses }) {
    const {
        setCurrentEditedCourseId,
        setCourseLandingFormData,
        setCourseCurriculumFormData
    } = useInstructor();

    const { fetchAdminAllCourses } = useAuth();

    const navigate = useNavigate();

    const handleDeleteCourse = async (id) => {
        try {
            const response = await deleteParticularCourse(id);
            console.log("Responses: ", response);
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
        }
    };


    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl sm:text-3xl font-extrabold">All Courses</CardTitle>
                <Button
                    onClick={() => {
                        setCurrentEditedCourseId(null);
                        setCourseLandingFormData(courseLandingInitialFormData);
                        setCourseCurriculumFormData(courseCurriculumInitialFromData);
                        navigate("/create-new-course");
                    }}
                    className="w-full sm:w-auto px-6 py-2"
                >
                    Create New Course
                </Button>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <Table className="min-w-full text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listOfCourses && listOfCourses.length > 0 ? (
                                listOfCourses.map((course) => (
                                    <TableRow key={course?._id}>
                                        <TableCell className="font-medium">
                                            {course?.title}
                                        </TableCell>
                                        <TableCell>
                                            {course?.students?.length}
                                        </TableCell>
                                        <TableCell>
                                            ₹{course?.students?.length * course?.pricing}
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end space-x-2">
                                            <Button
                                                onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteCourse(course?._id)}
                                                variant="ghost" size="icon">
                                                <Delete className="h-5 w-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6">
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
