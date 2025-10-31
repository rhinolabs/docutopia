import type { AuthCredentials } from "@/core/types";
import { useAuth, useOpenAPI } from "@/hooks";
import { Button, Card, Input, Select } from "@rhinolabs/ui";
import { Code, Eye, EyeOff, IdCard, Key, Shield } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

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
];

export const EnhancedCredentialsForm: React.FC = () => {
	const { credentials, updateCredentials, setAuthType } = useAuth();
	const { availableAuthTypes } = useOpenAPI();
	const [showPassword, setShowPassword] = useState(false);

	// Filter auth configs based on available types from the OpenAPI spec
	// If no security schemes are defined, show all auth types
	const availableAuthConfigs = authConfigs.filter((config) =>
		availableAuthTypes.length > 0
			? availableAuthTypes.includes(config.type)
			: true,
	);

	const currentConfig =
		availableAuthConfigs.find((config) => config.type === credentials.type) ||
		availableAuthConfigs[0];
	const IconComponent = currentConfig?.icon || Key;

	// Auto-switch to first available auth type if current type is not available
	useEffect(() => {
		if (
			availableAuthTypes.length > 0 &&
			!availableAuthTypes.includes(credentials.type) &&
			availableAuthConfigs.length > 0
		) {
			setAuthType(availableAuthConfigs[0].type);
		}
	}, [availableAuthTypes, credentials.type, availableAuthConfigs, setAuthType]);

	const handleAuthTypeChange = (type: AuthCredentials["type"]) => {
		setAuthType(type);
	};

	return (
		<Card className="border shadow-none rounded-lg bg-card/60">
			<Card.Header className="pb-2 pt-4 px-5">
				<div className="flex items-top justify-between">
					<div className="flex items-center gap-2">
						<IdCard className="h-4 w-4 text-muted-foreground" />
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							AUTH CONFIGURATION
						</h3>
					</div>
					{/* Auth Type Selector */}
					<Select value={credentials.type} onValueChange={handleAuthTypeChange}>
						<Select.Trigger className="w-[200px] h-8 text-foreground bg-card">
							<div className="flex items-center gap-2">
								<IconComponent className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium">
									{currentConfig?.label || "Select Auth"}
								</span>
							</div>
						</Select.Trigger>
						<Select.Content className="" align="end">
							{availableAuthConfigs.map((config) => {
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
			</Card.Header>

			<Card.Content className="pb-5 px-5">
				{/* Credential Input Fields */}
				{credentials.type === "basic" && (
					<div className="space-y-2">
						<label
							className="text-xs font-medium text-muted-foreground capitalize tracking-wider"
							htmlFor="username"
						>
							Username
						</label>
						<Input
							name="username"
							placeholder="Enter username"
							value={credentials.username || ""}
							onChange={(e) => updateCredentials({ username: e.target.value })}
							className="font-mono text-sm bg-card text-foreground"
						/>
					</div>
				)}

				<div className="space-y-2">
					<label
						className="text-xs font-medium text-muted-foreground capitalize tracking-wider"
						htmlFor={currentConfig?.fieldName}
					>
						{currentConfig?.fieldName || "credential"}
					</label>
					<div className="flex items-center gap-2 relative">
						<Input
							name={currentConfig?.fieldName}
							type={showPassword ? "text" : "password"}
							placeholder={currentConfig?.placeholder || "Enter credential"}
							value={credentials.value}
							onChange={(e) => updateCredentials({ value: e.target.value })}
							className="flex-1 font-mono text-sm bg-card text-foreground"
						/>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowPassword(!showPassword)}
							className="hover:bg-accent absolute right-0.5"
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				{/* Status Indicator */}
				{credentials.value && (
					<div className="flex items-center gap-2 mt-2">
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
