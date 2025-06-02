import { useState } from "react";
import { Card, Button, Input, Select } from "@rhinolabs/ui";
import { Copy } from "lucide-react";
import type { EnhancedOperation } from "@/types/api/openapi";

interface TryApiPanelProps {
	operation: EnhancedOperation;
}

/**
 * Try API Panel component matching Hyphen.ai design
 * This is the Q1 structure - full functionality will be implemented in Q2
 */
export const TryApiPanel = ({ operation }: TryApiPanelProps) => {
	const [authType, setAuthType] = useState("apikey");
	const [accessToken, setAccessToken] = useState("");

	// Mock cURL command based on the operation
	const mockCurlCommand = `curl --request ${operation.method} \\
  --url https://api.example.com${operation.path} \\
  --header 'accept: application/json'`;

	// Copy to clipboard function
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<div className="space-y-6">
			{/* Credentials Card */}
			<Card className="border  shadow-none rounded-lg bg-card">
				<Card.Header>
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						CREDENTIALS
					</h3>
				</Card.Header>
				<Card.Content>
					<div className="flex items-center space-x-2">
						<Select value={authType} onValueChange={setAuthType}>
							<Select.Trigger className="w-32 bg-input  text-foreground">
								<Select.Value />
							</Select.Trigger>
							<Select.Content className="bg-input ">
								<Select.Item
									value="apikey"
									className="text-foreground hover:bg-accent"
								>
									API Key
								</Select.Item>
								<Select.Item
									value="bearer"
									className="text-foreground hover:bg-accent"
								>
									Bearer
								</Select.Item>
								<Select.Item
									value="cookie"
									className="text-foreground hover:bg-accent"
								>
									Cookie
								</Select.Item>
							</Select.Content>
						</Select>
						<Input
							placeholder="access_token"
							value={accessToken}
							onChange={(e) => setAccessToken(e.target.value)}
							className="flex-1 font-mono text-sm bg-input  text-foreground"
						/>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => copyToClipboard(accessToken)}
							className="cursor-pointer hover:bg-accent"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</Card.Content>
			</Card>

			{/* cURL Request Card */}
			<Card className="border  shadow-none rounded-lg bg-card">
				<Card.Header>
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						CURL REQUEST
					</h3>
				</Card.Header>
				<Card.Content>
					<div className="relative">
						<pre className="bg-input p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground border ">
							<code>{mockCurlCommand}</code>
						</pre>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => copyToClipboard(mockCurlCommand)}
							className="absolute top-2 right-2 cursor-pointer hover:bg-accent"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</Card.Content>
			</Card>

			{/* Try It Button */}
			<div className="text-center">
				<Button
					size="lg"
					className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
				>
					Try It!
				</Button>
			</div>

			{/* Response Card */}
			<Card className="border border-border shadow-none rounded-lg bg-card">
				<Card.Header>
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							RESPONSE
						</h3>
						<Select defaultValue="examples">
							<Select.Trigger className="w-32 bg-input border-border text-foreground">
								<Select.Value />
							</Select.Trigger>
							<Select.Content className="bg-input border-border">
								<Select.Item
									value="examples"
									className="text-foreground hover:bg-accent"
								>
									EXAMPLES
								</Select.Item>
								<Select.Item
									value="schema"
									className="text-foreground hover:bg-accent"
								>
									SCHEMA
								</Select.Item>
							</Select.Content>
						</Select>
					</div>
				</Card.Header>
				<Card.Content>
					<div className="text-center py-8 text-muted-foreground">
						<p className="mb-2">
							Click "Try It!" to start a request and see the response here!
						</p>
						<p className="text-sm">Or choose an example:</p>
					</div>

					{/* Response Examples */}
					<div className="space-y-4">
						<div className="flex justify-center">
							<span className="text-sm text-foreground">application/json</span>
						</div>

						<div className="flex justify-center space-x-4">
							{Object.entries(operation.responses).map(([status]) => (
								<Button
									key={status}
									variant="outline"
									size="sm"
									className={`relative border-border hover:bg-accent ${
										status.startsWith("2")
											? "border-green-500 text-green-400"
											: status.startsWith("4")
												? "border-yellow-500 text-yellow-400"
												: "border-red-500 text-red-400"
									}`}
								>
									<span
										className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
											status.startsWith("2")
												? "bg-green-500"
												: status.startsWith("4")
													? "bg-yellow-500"
													: "bg-red-500"
										}`}
									/>
									{status}
								</Button>
							))}
						</div>
					</div>
				</Card.Content>
			</Card>
		</div>
	);
};
