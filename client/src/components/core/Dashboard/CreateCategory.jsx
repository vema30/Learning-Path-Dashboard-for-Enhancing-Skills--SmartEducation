import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { toast } from "react-hot-toast"
import { createCategory } from "../../../services/operations/courseAPI"
export default function CreateCategory() {
  const { token } = useSelector((state) => state.auth)
//   const { us } = useSelector((state) => state.profile)
//   console.log("us")
  const [user, setUser] = useState(null)
 console.log("token", token)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("Loaded user from localStorage:", parsedUser)
      } else {
        console.warn("No user found in localStorage")
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error("User not found.")
      return
    }

    if (user.accountType !== "Admin") {
      toast.error("Only Admins can create categories.")
      console.log("User accountType:", user.accountType)
      return
    }

    try {
      const data = { name, description }
      await createCategory(data, token)
      toast.success("Category created successfully")
      setName("")
      setDescription("")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category")
    }
  }

  return (
    <div className="p-6 bg-richblack-800 rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-richblack-5">Create New Category</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter category name"
          className="rounded-md p-2 text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter category description"
          className="rounded-md p-2 text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <button
         onClick={handleSubmit}
          className="bg-yellow-50 text-richblack-900 font-semibold py-2 rounded-md"
        >
          Create Category
        </button>
      </form>
    </div>
  )
}
