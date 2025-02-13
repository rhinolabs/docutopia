"use client";

import {
	Button,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@rhino-ui/ui";
import type { SidebarCollection } from "@/types/components/sidebar";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

interface SearchBarProps {
	navItems: SidebarCollection[];
}

export const SearchBar = ({ navItems }: SearchBarProps) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const isMac = navigator.platform.toUpperCase().includes("MAC");

	const searchResults = useMemo(
		() =>
			navItems.flatMap((collection) =>
				collection.requests.flatMap((request) =>
					request.items && request.items.length > 0
						? request.items.map((subItem) => ({
								label: subItem.name,
								url: subItem.url,
								requestType: subItem.requestType,
							}))
						: [
								{
									label: request.name,
									url: request.url,
								},
							],
				),
			),
		[navItems],
	);

	const filteredResults = useMemo(() => {
		if (!query) return searchResults;

		const queryTerms = query.toLowerCase().split(/\s+/);

		return searchResults.filter((result) =>
			queryTerms.every((term) => result.label.toLowerCase().includes(term)),
		);
	}, [query, searchResults]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setOpen((prev) => !prev);
			}

			if (e.key === "Escape") setOpen(false);
		};

		document.addEventListener("keydown", handler);

		return () => document.removeEventListener("keydown", handler);
	}, []);

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				className="w-full shadow-none text-muted-foreground text-xs flex justify-between my-2 cursor-pointer"
				onClick={() => setOpen(true)}
			>
				Search documentation...
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
					<span className="text-sm">{isMac ? "⌘" : "Ctrl+"}</span>K
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder="Type a command or search..."
					value={query}
					onValueChange={(value) => setQuery(value)}
				/>
				<CommandList>
					{filteredResults.length === 0 ? (
						<CommandEmpty>No results found.</CommandEmpty>
					) : (
						<CommandGroup heading="Links">
							{filteredResults.map((result) => (
								<CommandItem
									key={result.label}
									value={result.label}
									onSelect={() => setOpen(false)}
								>
									<Link
										to={`/docs/${result.url}`}
										mask={{
											to: `/docs#${result.url}`,
										}}
										onClick={() => setOpen(false)}
										className="[&.active]:font-bold"
									>
										{result.label}
									</Link>
								</CommandItem>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
};
