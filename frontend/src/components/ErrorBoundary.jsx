import React from 'react'
import { useRouteError } from 'react-router'

const ErrorBoundary = () => {
    const {data, status, statusText} = useRouteError();

  return (
    <div>
      <p className='text-2xl text-center'>{data}</p>
      <p className='text-xl text-center'>{status} - {statusText}</p>
    </div>
  );
}

export default ErrorBoundary
