import type { RequestHandler } from './$types';
import { API_KEY, MODEL, BACKEND_API_URL } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	const language = formData.get('language') as string;

	if (!file || !language) {
		return new Response(
			JSON.stringify({
				message: '파일 또는 언어 정보가 누락되었습니다.'
			}),
			{ status: 400 }
		);
	}

	try {
        const fileBuffer = await file.arrayBuffer();
        const blob = new Blob([fileBuffer], { type: file.type });
        const formDataForAPI = new FormData();

        const model = MODEL;
        const api_key = API_KEY;
        formDataForAPI.append('file', blob, file.name);
        formDataForAPI.append('language', language);
        formDataForAPI.append('model', model)
        formDataForAPI.append('api_key', api_key)

		const response = await fetch(`${BACKEND_API_URL}/upload`, {
			method: 'POST',
			body: formDataForAPI
		});

		if (!response.ok) {
			throw new Error('Failed to upload the file.');
		}

        const translatedBlob = await response.blob();
        const safeFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        return new Response(translatedBlob, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename=translated_${safeFileName}`,
            }
        })
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ message: 'An error occurred while translating the text.' }),
			{ status: 500 }
		);
	}
};
