import { Link } from '@tanstack/react-router';

import { ORIGINAL_ROBODOC } from '@/constants';

export function Header() {
    return (
        <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/40 px-4 py-3 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
                <h1 className="font-inter cursor-default text-2xl font-extralight select-none">
                    Robodoc{' '}
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text font-semibold text-transparent">
                        Start
                    </span>
                </h1>

                <a
                    href={ORIGINAL_ROBODOC}
                    target="_blank"
                    className="font-inter text-sm font-light text-gray-500 hover:underline"
                >
                    Acesse a versão original
                </a>
            </div>
        </header>
    );
}
