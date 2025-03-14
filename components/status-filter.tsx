"use client"

import { ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface StatusFilterProps {
  selectedStatus: string
  onStatusChange: (status: string) => void
}

export default function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const statuses = ["Все статусы", "Live", "Finished", "Match preparing"]

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleStatusSelect = (status: string) => {
    onStatusChange(status)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <button
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-900 border border-gray-800 rounded-md"
        onClick={toggleDropdown}
      >
        <span>{selectedStatus}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg">
          {statuses.map((status) => (
            <button
              key={status}
              className={`w-full text-left px-4 py-2 hover:bg-gray-800 ${
                status === selectedStatus ? "bg-gray-800" : ""
              }`}
              onClick={() => handleStatusSelect(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

