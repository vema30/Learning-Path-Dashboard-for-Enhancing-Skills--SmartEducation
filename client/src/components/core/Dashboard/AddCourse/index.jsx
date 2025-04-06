import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  return (
    <>
      <div className="flex w-full items-start gap-x-6 text-black">
        {/* Main Course Steps Area */}
        <div className="flex flex-1 flex-col">
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">Add Course</h1>
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>

        {/* Course Upload Tips (Sticky and visible on large screens) */}
        <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 xl:block">
          <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <ul>
    <li>Choose whether to set a price for your course or offer it for free to students.</li>
    <li>Ensure your course thumbnail is sized at 1024x576 pixels for the best display quality.</li>
    <li>Use the Video section to upload and manage the course introduction or preview video.</li>
    <li>Organize your course structure efficiently using the Course Builder tool.</li>
    <li>Create engaging lessons, quizzes, and assignments by adding topics in the Course Builder.</li>
    <li>Provide extra details in the Additional Data section, which will appear on the course page.</li>
    <li>Send announcements to keep enrolled students updated with important course-related information.</li>
</ul>

          </ul>
        </div>
      </div>
    </>
  );
}
