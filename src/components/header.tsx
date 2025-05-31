import { Link } from '@tanstack/react-router';

export function Header() {
    return (
        <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/40 px-4 py-3 backdrop-blur-md">
            <Link to="/" className="font-inter text-2xl font-extralight">
                Robodoc{' '}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
                    Start
                </span>
            </Link>
        </header>
    );
}
