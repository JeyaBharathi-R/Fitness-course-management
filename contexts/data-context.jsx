"use client"

import { createContext, useContext, useReducer, useState } from "react"
import { mockCourses, mockSessions, mockEnrollments, mockProgressRecords } from "@/lib/data"

const DataContext = createContext()

const initialState = {
  courses: mockCourses,
  sessions: mockSessions,
  enrollments: mockEnrollments,
  progressRecords: mockProgressRecords,
}

function dataReducer(state, action) {
  switch (action.type) {
    case "ADD_COURSE":
      return { ...state, courses: [...state.courses, action.payload] }
    case "UPDATE_COURSE":
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.id ? action.payload : course
        )
      }
    case "DELETE_COURSE":
      return {
        ...state,
        courses: state.courses.filter(course => course.id !== action.payload)
      }
    case "ADD_ENROLLMENT":
      return { ...state, enrollments: [...state.enrollments, action.payload] }
    case "UPDATE_ENROLLMENT":
      return {
        ...state,
        enrollments: state.enrollments.map(enrollment =>
          enrollment.id === action.payload.id ? action.payload : enrollment
        )
      }
    case "ADD_SESSION":
      return { ...state, sessions: [...state.sessions, action.payload] }
    case "UPDATE_SESSION":
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        )
      }
    case "ADD_PROGRESS_RECORD":
      return { ...state, progressRecords: [...state.progressRecords, action.payload] }
    default:
      return state
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const asyncDispatch = async (action) => {
    try {
      setLoading(true)
      setError(null)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      dispatch(action)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    ...state,
    loading,
    error,
    setLoading,
    setError,
    dispatch: asyncDispatch,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

