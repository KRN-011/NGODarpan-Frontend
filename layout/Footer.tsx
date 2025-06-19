'use client'

export default function Footer() {
    return (
        <footer className="w-full">
            <div className="bg-secondary dark:bg-muted-darker rounded-tl-2xl rounded-tr-2xl mx-3 py-3 text-center">
            All rights reserved &copy; {new Date().getFullYear()}
        </div>
        </footer>
    )
}