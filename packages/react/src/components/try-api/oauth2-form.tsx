"use client";

import type { OAuth2FlowType } from "@/core/types";
import { useAuth, useOpenAPI } from "@/hooks";
import { useOAuth2 } from "@/hooks/use-oauth2";
import {
	getAvailableOAuth2Flows,
	getOAuth2FlowDescription,
	getOAuth2FlowLabel,
} from "@/services/oauth2-client";
import type { OAuth2Flow } from "@/types/api/openapi/security";
import { getOAuth2Scheme } from "@/utils/map-security-schemes";
import { Badge, Button, Checkbox, Input, Label, Select } from "@rhinolabs/ui";
import {
	AlertCircle,
	Check,
	Clock,
	Eye,
	EyeOff,
	KeyRound,
	Loader2,
	LogOut,
	RefreshCw,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

interface OAuth2FormProps {
	onAuthenticated?: () => void;
}

export const OAuth2Form: React.FC<OAuth2FormProps> = ({ onAuthenticated }) => {
	const { spec } = useOpenAPI();
	const { credentials, updateCredentials } = useAuth();
	const {
		isAuthenticating,
		error,
		tokenExpiresAt,
		startAuthCodeFlow,
		authenticateWithClientCredentials,
		authenticateWithPassword,
		refreshAccessToken,
		isTokenExpired,
		clearOAuth2Auth,
	} = useOAuth2();

	const [showSecret, setShowSecret] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// Get OAuth2 scheme from spec
	const oauth2Scheme = useMemo(() => getOAuth2Scheme(spec), [spec]);

	// Get available flows from the scheme
	const availableFlows = useMemo(() => {
		if (!oauth2Scheme?.flows) return [];
		return getAvailableOAuth2Flows(oauth2Scheme.flows);
	}, [oauth2Scheme]);

	// Current selected flow
	const selectedFlow = credentials.oauth2?.flow || availableFlows[0];

	// Get flow config from scheme
	const flowConfig = useMemo((): OAuth2Flow | undefined => {
		if (!oauth2Scheme?.flows || !selectedFlow) return undefined;
		return oauth2Scheme.flows[selectedFlow];
	}, [oauth2Scheme, selectedFlow]);

	// Available scopes from the flow
	const availableScopes = useMemo(() => {
		if (!flowConfig?.scopes) return [];
		return Object.entries(flowConfig.scopes).map(([scope, description]) => ({
			scope,
			description,
		}));
	}, [flowConfig]);

	// Selected scopes
	const selectedScopes = credentials.oauth2?.scopes || [];

	// Auto-select first flow if none selected
	useEffect(() => {
		if (availableFlows.length > 0 && !credentials.oauth2?.flow) {
			updateCredentials({
				oauth2: {
					...credentials.oauth2,
					flow: availableFlows[0],
					clientId: credentials.oauth2?.clientId || "",
					scopes: credentials.oauth2?.scopes || [],
				},
			});
		}
	}, [availableFlows, credentials.oauth2, updateCredentials]);

	// Handle flow change
	const handleFlowChange = (flow: OAuth2FlowType) => {
		updateCredentials({
			oauth2: {
				...credentials.oauth2,
				flow,
				clientId: credentials.oauth2?.clientId || "",
				scopes: credentials.oauth2?.scopes || [],
			},
		});
	};

	// Handle scope toggle
	const handleScopeToggle = (scope: string, checked: boolean) => {
		const currentScopes = credentials.oauth2?.scopes || [];
		const newScopes = checked
			? [...currentScopes, scope]
			: currentScopes.filter((s) => s !== scope);

		updateCredentials({
			oauth2: {
				...credentials.oauth2,
				flow: credentials.oauth2?.flow || "authorizationCode",
				clientId: credentials.oauth2?.clientId || "",
				scopes: newScopes,
			},
		});
	};

	// Handle authentication
	const handleAuthenticate = async () => {
		if (!flowConfig) return;

		try {
			switch (selectedFlow) {
				case "authorizationCode":
					await startAuthCodeFlow({
						authorizationUrl: flowConfig.authorizationUrl || "",
						tokenUrl: flowConfig.tokenUrl || "",
						clientId: credentials.oauth2?.clientId || "",
						clientSecret: credentials.oauth2?.clientSecret,
						scopes: selectedScopes,
					});
					break;

				case "clientCredentials":
					await authenticateWithClientCredentials({
						tokenUrl: flowConfig.tokenUrl || "",
						clientId: credentials.oauth2?.clientId || "",
						clientSecret: credentials.oauth2?.clientSecret || "",
						scopes: selectedScopes,
					});
					onAuthenticated?.();
					break;

				case "password":
					await authenticateWithPassword({
						tokenUrl: flowConfig.tokenUrl || "",
						clientId: credentials.oauth2?.clientId || "",
						clientSecret: credentials.oauth2?.clientSecret,
						username,
						password,
						scopes: selectedScopes,
					});
					onAuthenticated?.();
					break;
			}
		} catch (err) {
			console.error("Authentication failed:", err);
		}
	};

	// Handle token refresh
	const handleRefresh = async () => {
		await refreshAccessToken();
	};

	// Handle logout
	const handleLogout = () => {
		clearOAuth2Auth();
		setUsername("");
		setPassword("");
	};

	// Format expiration time
	const formatExpiration = (expiresAt: number) => {
		const now = Date.now();
		const diff = expiresAt - now;
		if (diff <= 0) return "Expired";

		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) return `${hours}h ${minutes % 60}m`;
		return `${minutes}m`;
	};

	if (!oauth2Scheme) {
		return (
			<div className="text-sm text-muted-foreground">
				No OAuth2 configuration found in the API specification.
			</div>
		);
	}

	const isAuthenticated = Boolean(credentials.value);
	const tokenExpired = isTokenExpired();

	return (
		<div className="space-y-4">
			{/* Flow Selector */}
			{availableFlows.length > 1 && (
				<div className="space-y-2">
					<Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
						OAuth2 Flow
					</Label>
					<Select
						value={selectedFlow}
						onValueChange={(value) => handleFlowChange(value as OAuth2FlowType)}
					>
						<Select.Trigger className="w-full bg-card text-foreground">
							<span>{getOAuth2FlowLabel(selectedFlow)}</span>
						</Select.Trigger>
						<Select.Content>
							{availableFlows.map((flow) => (
								<Select.Item key={flow} value={flow}>
									<div className="flex flex-col gap-1 py-1">
										<span className="font-medium">
											{getOAuth2FlowLabel(flow)}
										</span>
										<span className="text-xs text-muted-foreground">
											{getOAuth2FlowDescription(flow)}
										</span>
									</div>
								</Select.Item>
							))}
						</Select.Content>
					</Select>
				</div>
			)}

			{/* Client ID */}
			<div className="space-y-2">
				<Label
					className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
					htmlFor="client-id"
				>
					Client ID
				</Label>
				<Input
					id="client-id"
					placeholder="Enter client ID"
					value={credentials.oauth2?.clientId || ""}
					onChange={(e) =>
						updateCredentials({
							oauth2: {
								...credentials.oauth2,
								flow: credentials.oauth2?.flow || "authorizationCode",
								clientId: e.target.value,
								scopes: credentials.oauth2?.scopes || [],
							},
						})
					}
					className="font-mono text-sm bg-card text-foreground"
					disabled={isAuthenticated}
				/>
			</div>

			{/* Client Secret (for flows that need it) */}
			{(selectedFlow === "clientCredentials" ||
				selectedFlow === "authorizationCode") && (
				<div className="space-y-2">
					<Label
						className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
						htmlFor="client-secret"
					>
						Client Secret{" "}
						{selectedFlow === "authorizationCode" && (
							<span className="text-muted-foreground/60">(optional)</span>
						)}
					</Label>
					<div className="relative">
						<Input
							id="client-secret"
							type={showSecret ? "text" : "password"}
							placeholder="Enter client secret"
							value={credentials.oauth2?.clientSecret || ""}
							onChange={(e) =>
								updateCredentials({
									oauth2: {
										...credentials.oauth2,
										flow: credentials.oauth2?.flow || "authorizationCode",
										clientId: credentials.oauth2?.clientId || "",
										clientSecret: e.target.value,
										scopes: credentials.oauth2?.scopes || [],
									},
								})
							}
							className="font-mono text-sm bg-card text-foreground pr-10"
							disabled={isAuthenticated}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setShowSecret(!showSecret)}
							className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
							disabled={isAuthenticated}
						>
							{showSecret ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			)}

			{/* Username/Password (for password flow) */}
			{selectedFlow === "password" && (
				<>
					<div className="space-y-2">
						<Label
							className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
							htmlFor="username"
						>
							Username
						</Label>
						<Input
							id="username"
							placeholder="Enter username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="font-mono text-sm bg-card text-foreground"
							disabled={isAuthenticated}
						/>
					</div>
					<div className="space-y-2">
						<Label
							className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
							htmlFor="password"
						>
							Password
						</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="font-mono text-sm bg-card text-foreground pr-10"
								disabled={isAuthenticated}
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
								disabled={isAuthenticated}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
				</>
			)}

			{/* Scopes Selector */}
			{availableScopes.length > 0 && (
				<div className="space-y-2">
					<Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
						Scopes
					</Label>
					<div className="space-y-2 rounded-md border border-border bg-card/50 p-3">
						{availableScopes.map(({ scope, description }) => (
							<div key={scope} className="flex items-start gap-3">
								<Checkbox
									id={`scope-${scope}`}
									checked={selectedScopes.includes(scope)}
									onCheckedChange={(checked) =>
										handleScopeToggle(scope, checked as boolean)
									}
									disabled={isAuthenticated}
								/>
								<div className="flex flex-col gap-0.5">
									<Label
										htmlFor={`scope-${scope}`}
										className="text-sm font-medium cursor-pointer"
									>
										{scope}
									</Label>
									{description && (
										<span className="text-xs text-muted-foreground">
											{description}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Error Display */}
			{error && (
				<div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
					<AlertCircle className="h-4 w-4 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{/* Token Status */}
			{isAuthenticated && (
				<div className="flex items-center gap-2 text-sm bg-muted/50 rounded-md p-3">
					{tokenExpired ? (
						<>
							<AlertCircle className="h-4 w-4 text-amber-500" />
							<span className="text-amber-500">Token expired</span>
						</>
					) : (
						<>
							<Check className="h-4 w-4 text-green-500" />
							<span className="text-green-500">Authenticated</span>
							{tokenExpiresAt && (
								<Badge variant="secondary" className="ml-auto text-xs">
									<Clock className="h-3 w-3 mr-1" />
									{formatExpiration(tokenExpiresAt)}
								</Badge>
							)}
						</>
					)}
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex gap-2">
				{!isAuthenticated ? (
					<Button
						onClick={handleAuthenticate}
						disabled={isAuthenticating || !credentials.oauth2?.clientId}
						className="flex-1"
					>
						{isAuthenticating ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Authenticating...
							</>
						) : (
							<>
								<KeyRound className="h-4 w-4 mr-2" />
								Authenticate
							</>
						)}
					</Button>
				) : (
					<>
						{credentials.oauth2?.refreshToken && (
							<Button
								variant="outline"
								onClick={handleRefresh}
								disabled={isAuthenticating}
								className="flex-1"
							>
								{isAuthenticating ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<RefreshCw className="h-4 w-4 mr-2" />
								)}
								Refresh Token
							</Button>
						)}
						<Button variant="outline" onClick={handleLogout}>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>
					</>
				)}
			</div>

			{/* Auth Code Flow Info */}
			{selectedFlow === "authorizationCode" && !isAuthenticated && (
				<p className="text-xs text-muted-foreground">
					Clicking Authenticate will open a popup for authorization. Make sure
					popups are enabled.
				</p>
			)}
		</div>
	);
};
