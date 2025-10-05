"use client";

interface Props {
  provider: "google" | "github";
}

export default function OAuthButton({ provider }: Props) {
  const handleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-gray-100 border py-2 rounded flex items-center justify-center hover:bg-gray-200 mt-2"
    >
      Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
}
