import { Button, DropdownMenu } from "@rhinolabs/ui";
import { CheckIcon, ChevronsUpDown, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

export const SidebarSettings = ({
	children,
}: { children: React.ReactNode }) => {
	const { setTheme, theme, themes } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenu.Trigger asChild>
				<Button
					variant="secondary"
					className="w-full flex justify-between items-center bg-background dark:hover:!bg-accent  h-12"
				>
					{children}
					<ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start" className="w-[15rem] bg-accent">
				<DropdownMenu.Label>Settings</DropdownMenu.Label>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<SunMoonIcon className="h-4 w-4 mr-2" /> Change Theme
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent alignOffset={-36}>
						{themes.map((t) => (
							<DropdownMenu.Item
								key={t}
								onSelect={() => setTheme(t)}
								className={`${theme === t ? "font-medium border" : "text-muted-foreground"} capitalize flex items-center justify-between`}
							>
								<span>{t}</span>
								{theme === t && <CheckIcon className="ml-2" />}
							</DropdownMenu.Item>
						))}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Content>
		</DropdownMenu>
	);
};
