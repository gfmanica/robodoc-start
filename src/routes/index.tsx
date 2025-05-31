import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Home
});

function Home() {
    return (
        <div className="p-2">
            <h1>Hello World</h1>
        </div>
    );
}
