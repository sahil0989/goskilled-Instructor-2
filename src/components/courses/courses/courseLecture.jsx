import { useCallback } from "react";
import { useInstructor } from "../../../context/instructor-context/InstructorContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { Switch } from "../../../@/components/ui/switch";
import { Label } from "../../../@/components/ui/label";
import VideoPlayer from "../../video-player/video-player";

function CourseCurriculum() {
  const { courseCurriculumFormData, setCourseCurriculumFormData } = useInstructor();

  const handleNewLecture = useCallback(() => {
    setCourseCurriculumFormData((prev) => [
      ...prev,
      { title: "", videoUrl: "", freePreview: false },
    ]);
  }, [setCourseCurriculumFormData]);

  const handleCourseTitleChange = useCallback(
    (event, currentIndex) => {
      const value = event.target.value;
      setCourseCurriculumFormData((prev) => {
        const copy = [...prev];
        copy[currentIndex] = { ...copy[currentIndex], title: value };
        return copy;
      });
    },
    [setCourseCurriculumFormData]
  );

  const handleFreePreviewChange = useCallback(
    (value, currentIndex) => {
      setCourseCurriculumFormData((prev) => {
        const copy = [...prev];
        copy[currentIndex] = { ...copy[currentIndex], freePreview: value };
        return copy;
      });
    },
    [setCourseCurriculumFormData]
  );

  const handleYoutubeUrlChange = useCallback(
    (event, currentIndex) => {
      const value = event.target.value;
      setCourseCurriculumFormData((prev) => {
        const copy = [...prev];
        copy[currentIndex] = { ...copy[currentIndex], videoUrl: value };
        return copy;
      });
    },
    [setCourseCurriculumFormData]
  );

  const handleDeleteLecture = useCallback(
    (currentIndex) => {
      if (window.confirm("Are you sure you want to delete this lecture?")) {
        setCourseCurriculumFormData((prev) =>
          prev.filter((_, i) => i !== currentIndex)
        );
      }
    },
    [setCourseCurriculumFormData]
  );

  // Validate all lectures: non-empty title and a valid URL (basic check)
  function isCourseCurriculumFormDataValid() {
    return (
      courseCurriculumFormData.length > 0 &&
      courseCurriculumFormData.every(
        (item) =>
          item.title.trim() !== "" &&
          item.videoUrl.trim() !== "" &&
          isValidUrl(item.videoUrl.trim())
      )
    );
  }

  // Basic URL validation helper
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid()}
          onClick={handleNewLecture}
          className="mb-4"
          aria-label="Add new lecture"
        >
          Add Lecture
        </Button>

        {courseCurriculumFormData.length === 0 && (
          <p className="text-center text-gray-500">No lectures added yet.</p>
        )}

        <div className="mt-4 space-y-6">
          {courseCurriculumFormData.map((item, index) => (
            <div
              key={index}
              className="border p-5 rounded-md space-y-4 shadow-md bg-white"
            >
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h3 className="font-semibold whitespace-nowrap">
                      Lecture {index + 1}
                    </h3>
                    <Input
                      type="text"
                      placeholder="Enter lecture title"
                      className="w-full md:w-1/2"
                      value={item.title}
                      onChange={(e) => handleCourseTitleChange(e, index)}
                      aria-label={`Lecture ${index + 1} title`}
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        onCheckedChange={(value) =>
                          handleFreePreviewChange(value, index)
                        }
                        checked={item.freePreview}
                        id={`freePreview-${index}`}
                        aria-label={`Lecture ${index + 1} free preview toggle`}
                      />
                      <Label htmlFor={`freePreview-${index}`}>Free Preview</Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Input
                      type="url"
                      placeholder="Paste YouTube video URL"
                      className="w-full"
                      value={item.videoUrl}
                      onChange={(e) => handleYoutubeUrlChange(e, index)}
                      aria-label={`Lecture ${index + 1} video URL`}
                      required
                    />
                    {!isValidUrl(item.videoUrl.trim()) && item.videoUrl.trim() !== "" && (
                      <p className="text-sm text-red-600 mt-1">
                        Please enter a valid URL.
                      </p>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        aria-label={`Delete lecture ${index + 1}`}
                        type="button"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                </div>

                {item.videoUrl && isValidUrl(item.videoUrl.trim()) && (
                  <div className="mt-4 w-full lg:w-1/3">
                    <VideoPlayer url={item.videoUrl} width="100%" height="200px" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
