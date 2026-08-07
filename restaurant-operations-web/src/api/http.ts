const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type ApiErrorResponse = {
    error?: string;
    message?: string;
    detail?: string;
    title?: string;
    errors?: Record<string, string[] | string>;
};

async function extractErrorMessage(
    response: Response,
    fallbackMessage: string,
): Promise<string> {
    const responseText = await response.text();

    if (!responseText.trim()) {
        return fallbackMessage;
    }

    try {
        const body: unknown = JSON.parse(responseText);

        if (typeof body === "string") {
            return body;
        }

        if (body && typeof body === "object") {
            const errorBody = body as ApiErrorResponse;

            if (errorBody.error?.trim()) {
                return errorBody.error;
            }

            if (errorBody.message?.trim()) {
                return errorBody.message;
            }

            if (errorBody.detail?.trim()) {
                return errorBody.detail;
            }

            if (errorBody.errors) {
                const validationMessages = Object.values(errorBody.errors)
                    .flatMap((value) => (Array.isArray(value) ? value : [value]))
                    .map((value) => value.trim())
                    .filter(Boolean);

                if (validationMessages.length > 0) {
                    return validationMessages.join(" ");
                }
            }

            if (errorBody.title?.trim()) {
                return errorBody.title;
            }
        }
    } catch {
        // The API returned plain text instead of JSON.
    }

    return responseText.trim() || fallbackMessage;
}

export async function apiRequest<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const message = await extractErrorMessage(
            response,
            `Request failed with status ${response.status}.`,
        );

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}