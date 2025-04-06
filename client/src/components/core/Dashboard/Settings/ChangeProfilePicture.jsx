import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { toast } from "react-hot-toast"
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function ChangeProfilePicture() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image")
      return
    }

    setSelectedFile(file)
    previewFile(file)
    toast.success("Image selected")
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
    reader.onerror = () => toast.error("Failed to preview image")
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    onDrop,
  })

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("displayPicture", selectedFile)

    try {
      await dispatch(updateDisplayPicture(token, formData))
      toast.success("Profile picture updated!")
      setSelectedFile(null)
      setPreviewSource(null)
    } catch (err) {
      toast.error("Failed to upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 sm:p-8 text-richblack-5 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={previewSource || user?.image || "/default-avatar.png"}
          alt="Profile"
          className="aspect-square w-[90px] sm:w-[100px] rounded-full object-cover border border-richblack-600 shadow-md"
        />

        <div className="w-full">
          <p className="text-base font-semibold text-richblack-25 mb-3">Change Profile Picture</p>

          <div
            {...getRootProps()}
            className={`${
              isDragActive ? "bg-richblack-600" : "bg-richblack-700"
            } flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-richblack-500 px-5 py-6 transition-all hover:border-yellow-200 hover:bg-richblack-600`}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="flex flex-col items-center">
              <FiUploadCloud className="text-3xl text-yellow-100 mb-2" />
              <p className="text-sm text-center text-richblack-200">
                Drag & drop or <span className="font-semibold text-yellow-50">click</span> to select image
              </p>
              <p className="text-xs text-richblack-400 mt-1">JPG, PNG, WEBP (Max size: 5MB)</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleUpload}
              disabled={loading}
              className={`text-xs text-pink-200 underline ${selectedFile ? "hidden" : ""}`}
            >
              {!loading && <FiUploadCloud className="text-lg text-richblack-900" />}
            </IconBtn>

            {selectedFile && (
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewSource(null)
                }}
                

              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
