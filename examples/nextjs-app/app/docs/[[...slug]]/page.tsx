import { Docutopia } from "@docutopia/nextjs";

export default function DocsPage() {
	return (
		<Docutopia
			specUrl="https://petstore3.swagger.io/api/v3/openapi.json"
			baseUrl="https://petstore3.swagger.io"
		/>
	);
}
