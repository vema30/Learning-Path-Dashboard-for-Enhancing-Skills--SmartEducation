import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import Footer from "../../components/common/Footer"
import Course_Card from "../../components/core/Catalog/Course_Card"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { getCatalogPageData } from "../../services/operations/pageAndComponentData"
import Error from "./Error"

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()

  // UI state
  const [active, setActive] = useState(1) // 1: Most Popular, 2: New

  // Data states
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  const [categoryFetchError, setCategoryFetchError] = useState(null)
  const [catalogFetchError, setCatalogFetchError] = useState(null)
  const [categoryNotFound, setCategoryNotFound] = useState(false)

  // Helper function to normalize category name from URL param
  const normalizeName = (name) => name.split(" ").join("-").toLowerCase()

  // Fetch Categories and find matching categoryId
  useEffect(() => {
    setCategoryFetchError(null)
    setCategoryNotFound(false)
    setCategoryId("")
    setCatalogPageData(null)
    setCatalogFetchError(null)

    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        // Find category matching catalogName param
        const matchedCategory = res?.data?.data?.find(
          (ct) => normalizeName(ct.name) === catalogName.toLowerCase()
        )

        if (matchedCategory?._id) {
          setCategoryId(matchedCategory._id)
        } else {
          setCategoryNotFound(true)
        }
      } catch (error) {
        setCategoryFetchError("Could not fetch categories. Please try again later.")
        console.error("Could not fetch Categories:", error)
      }
    })()
  }, [catalogName])

  // Fetch Catalog Page Data when categoryId is set
  useEffect(() => {
    if (!categoryId) return

    setCatalogFetchError(null)
    setCatalogPageData(null)

    ;(async () => {
      try {
        const res = await getCatalogPageData(categoryId)
        if (res?.success) {
          setCatalogPageData(res)
        } else {
          setCatalogFetchError("Failed to load catalog data.")
        }
      } catch (error) {
        setCatalogFetchError("Error fetching catalog data. Please try again later.")
        console.error("Error fetching catalog page data:", error)
      }
    })()
  }, [categoryId])

  // Show spinner while loading or waiting for data
  if (loading || (!catalogPageData && !categoryFetchError && !categoryNotFound && !catalogFetchError)) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // Show error if category fetch failed
  if (categoryFetchError) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center text-red-500">
        {categoryFetchError}
      </div>
    )
  }

  // Show error if category not found
  if (categoryNotFound) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-yellow-400">
        <p>Category "{catalogName}" not found.</p>
        <p>Please check the URL or select a valid category.</p>
      </div>
    )
  }

  // Show error if catalog page data fetch failed
  if (catalogFetchError) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center text-red-500">
        {catalogFetchError}
      </div>
    )
  }

  // If catalogPageData is present but success false, show generic error
  if (catalogPageData && !catalogPageData.success) {
    return <Error />
  }

  // Extract courses
  const selectedCourses = catalogPageData?.data?.selectedCategory?.courses || []
  const differentCourses = catalogPageData?.data?.differentCategory?.courses || []

  // Filter selected courses based on active tab
  // Assuming courses have 'popularity' (number) and 'createdAt' (ISO string) fields
  const filteredSelectedCourses = selectedCourses.slice() // copy array to avoid mutating original
  if (active === 1) {
    // Sort by popularity descending
    filteredSelectedCourses.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  } else if (active === 2) {
    // Sort by newest first
    filteredSelectedCourses.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
  }

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            Home / Catalog /{" "}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 - Selected Category Courses */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSelectedCourses.length > 0 ? (
            filteredSelectedCourses.map((course) => (
              <Course_Card course={course} key={course._id} Height="h-[400px]" />
            ))
          ) : (
            <p className="text-richblack-100">No courses found in this category.</p>
          )}
        </div>
      </div>

      {/* Section 2 - Different Category Courses */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-8">
          {differentCourses.length > 0 ? (
            differentCourses.map((course) => (
              <Course_Card course={course} key={course._id} Height="h-[400px]" />
            ))
          ) : (
            <p className="text-richblack-100">No courses available in other categories.</p>
          )}
        </div>
      </div>

      {/* Section 3 - Frequently Bought (using selectedCourses again) */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-8">
          {selectedCourses.length > 0 ? (
            selectedCourses.map((course) => (
              <Course_Card course={course} key={course._id} Height="h-[400px]" />
            ))
          ) : (
            <p className="text-richblack-100">No frequently bought courses found.</p>
          )}
        </div>
      </div>

      <Footer />

      {/* DEBUGGING OUTPUT (optional - remove in production) */}
      <div className="text-white bg-gray-800 p-4 mt-4 overflow-auto max-h-[400px] text-xs">
      </div>
    </>
  )
}

export default Catalog
