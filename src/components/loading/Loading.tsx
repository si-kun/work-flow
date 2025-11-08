import { LoaderIcon } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <LoaderIcon
    role="status"
    aria-label="Loading"
    className={cn("size-4 animate-spin", className)}
    {...props}
  />
  )
}

export default Loading