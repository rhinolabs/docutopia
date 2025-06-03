import type React from "react";
import { useState } from "react";
import { Card, Select, Input, Button } from "@rhinolabs/ui";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks";
import { CopyButton } from "@/components/common/CopyButton";
import type { AuthCredentials } from "@/core/types";

export const CredentialsForm: React.FC = () => {
	const { credentials, updateCredentials } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	return (
		<Card className="border shadow-none rounded-lg bg-card">
			<Card.Header>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					CREDENTIALS
				</h3>
			</Card.Header>
			<Card.Content className="space-y-4">
				<div className="flex items-center space-x-2">
					<Select
						value={credentials.type}
						onValueChange={(type: AuthCredentials["type"]) =>
							updateCredentials({ type: type })
						}
					>
						<Select.Trigger className="w-32 bg-input text-foreground">
							<Select.Value />
						</Select.Trigger>
						<Select.Content className="bg-input">
							<Select.Item value="apiKey">API Key</Select.Item>
							<Select.Item value="bearer">Bearer Token</Select.Item>
							<Select.Item value="basic">Basic Auth</Select.Item>
						</Select.Content>
					</Select>

					<Input
						type={showPassword ? "text" : "password"}
						placeholder={
							credentials.type === "apiKey"
								? "Your API Key"
								: credentials.type === "bearer"
									? "Bearer Token"
									: "Password"
						}
						value={credentials.value}
						onChange={(e) => updateCredentials({ value: e.target.value })}
						className="flex-1 font-mono text-sm bg-input text-foreground"
					/>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowPassword(!showPassword)}
						className="hover:bg-accent"
					>
						{showPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</Button>

					<CopyButton text={credentials.value} className="hover:bg-accent" />
				</div>

				{credentials.type === "basic" && (
					<Input
						placeholder="Username"
						value={credentials.username || ""}
						onChange={(e) => updateCredentials({ username: e.target.value })}
						className="font-mono text-sm bg-input text-foreground"
					/>
				)}
			</Card.Content>
		</Card>
	);
};
