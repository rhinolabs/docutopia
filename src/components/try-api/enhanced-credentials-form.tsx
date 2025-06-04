import type { AuthCredentials } from "@/core/types";
import { useAuth } from "@/hooks";
import { Badge, Button, Card, Input, Select } from "@rhinolabs/ui";
import { Code, Cookie, Eye, EyeOff, Key, Shield } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface AuthTypeConfig {
	type: AuthCredentials["type"];
	icon: React.ElementType;
	label: string;
	description: string;
	placeholder: string;
	fieldName: string;
}

const authConfigs: AuthTypeConfig[] = [
	{
		type: "apiKey",
		icon: Key,
		label: "API Key",
		description: "Authenticate with your API Key in headers",
		placeholder: "Enter your API key",
		fieldName: "x-api-key",
	},
	{
		type: "bearer",
		icon: Shield,
		label: "Bearer Token",
		description: "Authenticate with a Bearer access token",
		placeholder: "Enter bearer token",
		fieldName: "token",
	},
	{
		type: "basic",
		icon: Code,
		label: "Basic Auth",
		description: "Authenticate with username and password",
		placeholder: "Enter password",
		fieldName: "password",
	},
	{
		type: "cookie",
		icon: Cookie,
		label: "Cookie",
		description: "Authenticate with session cookie",
		placeholder: "Enter cookie value",
		fieldName: "session_token",
	},
];

export const EnhancedCredentialsForm: React.FC = () => {
	const { credentials, updateCredentials, setAuthType } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const currentConfig =
		authConfigs.find((config) => config.type === credentials.type) ||
		authConfigs[0];
	const IconComponent = currentConfig.icon;

	const handleAuthTypeChange = (type: AuthCredentials["type"]) => {
		setAuthType(type);
	};

	return (
		<Card className="border shadow-none rounded-lg bg-card">
			<Card.Header className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Key className="h-4 w-4 text-primary" />
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							CREDENTIALS
						</h3>
					</div>
					<Badge variant="outline" className="text-xs font-medium">
						{currentConfig.label}
					</Badge>
				</div>
			</Card.Header>

			<Card.Content className="space-y-4">
				{/* Auth Type Selector */}
				<div className="space-y-2">
					<Select value={credentials.type} onValueChange={handleAuthTypeChange}>
						<Select.Trigger className="w-full bg-input text-foreground">
							<div className="flex items-center gap-2">
								<IconComponent className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium">{currentConfig.label}</span>
							</div>
						</Select.Trigger>
						<Select.Content className="bg-input">
							{authConfigs.map((config) => {
								const ConfigIcon = config.icon;
								return (
									<Select.Item key={config.type} value={config.type}>
										<div className="flex flex-col gap-1 py-1">
											<div className="flex items-center gap-2">
												<ConfigIcon className="h-4 w-4" />
												<span className="font-medium">{config.label}</span>
											</div>
											<span className="text-xs text-muted-foreground">
												{config.description}
											</span>
										</div>
									</Select.Item>
								);
							})}
						</Select.Content>
					</Select>
				</div>

				{/* Credential Input Fields */}
				<div className="space-y-3">
					{credentials.type === "basic" && (
						<div className="space-y-2">
							<label
								className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
								htmlFor="username"
							>
								Username
							</label>
							<Input
								name="username"
								placeholder="Enter username"
								value={credentials.username || ""}
								onChange={(e) =>
									updateCredentials({ username: e.target.value })
								}
								className="font-mono text-sm bg-input text-foreground"
							/>
						</div>
					)}

					<div className="space-y-2">
						<label
							className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
							htmlFor={currentConfig.fieldName}
						>
							{currentConfig.fieldName}
						</label>
						<div className="flex items-center gap-2">
							<Input
								name={currentConfig.fieldName}
								type={showPassword ? "text" : "password"}
								placeholder={currentConfig.placeholder}
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
						</div>
					</div>
				</div>

				{/* Status Indicator */}
				{credentials.value && (
					<div className="flex items-center gap-2 pt-2">
						<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
						<span className="text-xs text-muted-foreground">
							Credentials configured
						</span>
					</div>
				)}
			</Card.Content>
		</Card>
	);
};
