import { useState, useEffect } from "react";
import { Button } from "../../../@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { Textarea } from "../../../@/components/ui/textarea";
import { useInstructor } from "../../../context/instructor-context/InstructorContext";

function CourseLandingPage() {
  const { courseLandingFormData, setCourseLandingFormData } = useInstructor();
  const [loading, setLoading] = useState(true);

  // Simulate loading state for skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // simulate 1s loading
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseLandingFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const description = formData.get("description");
    const pricing = formData.get("pricing");
    const objectives = formData.get("objectives");
    const welcomeMessage = formData.get("welcomeMessage");

    setCourseLandingFormData({
      title,
      subtitle,
      description,
      pricing,
      welcomeMessage,
      objectives,
      image: courseLandingFormData?.image,
      imagePublicId: courseLandingFormData?.imagePublicId,
    });
  };

  const isFormValid = Object.values(courseLandingFormData).every(
    (val) => val !== "" && val !== null && val !== undefined
  );

  const renderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="h-10 bg-gray-300 rounded w-full"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto md:p-4">
      <Card>
        <CardHeader>
          <CardTitle>Course Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            renderSkeleton()
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a title"
                  type="text"
                  onChange={handleChange}
                  value={courseLandingFormData?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  type="text"
                  placeholder="Enter a subtitle"
                  onChange={handleChange}
                  value={courseLandingFormData?.subtitle}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  onChange={handleChange}
                  value={courseLandingFormData?.description}
                  placeholder="Enter a description"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing">Price</Label>
                <Input
                  id="pricing"
                  name="pricing"
                  type="number"
                  placeholder="Enter a price"
                  onChange={handleChange}
                  value={courseLandingFormData?.pricing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">Objectives</Label>
                <Textarea
                  id="objectives"
                  name="objectives"
                  onChange={handleChange}
                  value={courseLandingFormData?.objectives}
                  placeholder="Enter objectives"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  onChange={handleChange}
                  value={courseLandingFormData?.welcomeMessage}
                  placeholder="Enter a welcome message"
                  required
                />
              </div>

              <Button disabled={!isFormValid} type="submit" className="w-full">
                Submit
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseLandingPage;
