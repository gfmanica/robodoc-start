export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t border-gray-200 py-4">
            <div className="container mx-auto">
                <p className="text-center text-sm font-light text-gray-500">
                    &copy; {currentYear} Robodoc Start - Gabriel Felipe Manica.
                    Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
