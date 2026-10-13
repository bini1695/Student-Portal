import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}