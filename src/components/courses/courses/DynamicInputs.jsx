import { useInstructor } from "../../../context/instructor-context/InstructorContext";
import { useCallback } from "react";


function DynamicListInput({ label, values, setValues, placeholder, fields }) {
  const handleChange = (index, value, fieldName) => {
    if (fields && fields.length > 0) {
      // Object mode (multiple fields per item)
      const newValues = [...values];
      newValues[index] = { ...newValues[index], [fieldName]: value };
      setValues(newValues);
    } else {
      // Simple string mode
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
    }
  };

  const handleAdd = () => {
    if (fields && fields.length > 0) {
      const emptyItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
      setValues([...values, emptyItem]);
    } else {
      setValues([...values, ""]);
    }
  };

  const handleRemove = (index) => setValues(values.filter((_, i) => i !== index));

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2 text-lg">{label}</label>
      {values.map((item, i) => (
        <div key={i} className="mb-4 p-4 border rounded space-y-3 flex flex-col">
          {fields && fields.length > 0 ? (
            // Object mode: render input per field
            fields.map(({ name, placeholder }) => (
              <input
                key={name}
                type="text"
                placeholder={placeholder}
                value={item[name] || ""}
                onChange={(e) => handleChange(i, e.target.value, name)}
                className="border rounded w-full p-2"
              />
            ))
          ) : (
            // String mode: render single input
            <input
              type="text"
              placeholder={placeholder}
              value={item}
              onChange={(e) => handleChange(i, e.target.value)}
              className="border rounded w-full p-2"
            />
          )}
          <button
            type="button"
            onClick={() => handleRemove(i)}
            className="text-red-600 font-bold"
            aria-label={`Remove ${label} item`}
          >
            Remove {label}
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
      >
        + Add {label}
      </button>
    </div>
  );
}

export default function ExtraDetailsForm() {
    const { courseLandingFormData, setCourseLandingFormData } = useInstructor();

    const heroSection = courseLandingFormData.heroSection || {
        features: [],
        bannerText: "",
        callToAction: "",
    };

    const setHeroSection = useCallback(
        (newHero) => {
            setCourseLandingFormData((prev) => ({
                ...prev,
                heroSection: newHero,
            }));
        },
        [setCourseLandingFormData]
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Hero Section */}
            <div>

                <DynamicListInput
                    label="Hero Section"
                    values={heroSection.content}
                    setValues={(vals) => setHeroSection({ ...heroSection, content: vals })}
                    placeholder="Hero Section description"
                />

                <DynamicListInput
                    label="Features"
                    values={heroSection.features}
                    setValues={(vals) => setHeroSection({ ...heroSection, features: vals })}
                    placeholder="Feature description"
                />
            </div>

            {/* Why Choose */}
            <DynamicListInput
                label="Why Choose"
                values={courseLandingFormData.whyChoose || []}
                setValues={(vals) =>
                    setCourseLandingFormData((prev) => ({ ...prev, whyChoose: vals }))
                }
                placeholder="Reason to choose"
            />

            {/* What You Will Learn */}
            <DynamicListInput
                label="What You Will Learn"
                values={courseLandingFormData.whatYouWillLearn || []}
                setValues={(vals) =>
                    setCourseLandingFormData((prev) => ({ ...prev, whatYouWillLearn: vals }))
                }
                placeholder="Learning outcome"
            />

            {/* Who Is This For */}
            <DynamicListInput
                label="Who Is This For"
                values={courseLandingFormData.whoIsThisFor || []}
                setValues={(vals) =>
                    setCourseLandingFormData((prev) => ({ ...prev, whoIsThisFor: vals }))
                }
                placeholder="Target audience description"
            />

            <DynamicListInput
                label="Reviews"
                values={courseLandingFormData.reviews || []}
                setValues={(vals) =>
                    setCourseLandingFormData((prev) => ({ ...prev, reviews: vals }))
                }
                fields={[
                    { name: "reviewer", placeholder: "Reviewer Name" },
                    { name: "rating", placeholder: "Rating (0-5)" },
                    { name: "comment", placeholder: "Comment" },
                ]}
            />

            {/* FAQs */}
            <DynamicListInput
                label="FAQs"
                values={courseLandingFormData.faqs || []}
                setValues={(vals) =>
                    setCourseLandingFormData((prev) => ({ ...prev, faqs: vals }))
                }
                fields={[
                    { name: "question", placeholder: "Question" },
                    { name: "answer", placeholder: "Answer" },
                ]}
            />
        </div>
    );
}
