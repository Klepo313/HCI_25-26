"use client";

import { useState } from "react";

interface CarImageProps {
  imageUrl: string;
  carMake: string;
  carName: string;
}

export default function CarImage({ imageUrl, carMake, carName }: CarImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {/* Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-2 text-gray-400"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <circle cx="10" cy="13" r="2" />
            <path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" />
          </svg>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {carMake} {carName}
          </p>
        </div>
      </div>
      {!imageError && (
        <img
          src={imageUrl}
          alt={`${carMake} ${carName}`}
          className="relative h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      )}
    </>
  );
}
