import { Link } from '@tanstack/react-router';

export function Header() {
    return (
        <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/40 py-2 px-4 backdrop-blur-md">
            <Link to="/" className="font-inter text-2xl font-light">
                Robodoc
            </Link>
        </header>
    );
}
