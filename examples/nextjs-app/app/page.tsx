import Link from "next/link";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
			<div className="text-center space-y-6">
				<h1 className="text-4xl font-bold">Docutopia - Next.js Example</h1>
				<p className="text-muted-foreground text-lg">
					A modern, interactive API documentation library
				</p>
				<Link
					href="/docs"
					className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					View API Documentation
				</Link>
			</div>
		</main>
	);
}
