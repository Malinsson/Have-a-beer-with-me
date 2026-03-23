type AuthAction = 'login' | 'signup';

type SupabaseLikeError = {
    message?: string;
    status?: number;
    code?: string;
};

const isSupabaseLikeError = (value: unknown): value is SupabaseLikeError => {
    return typeof value === 'object' && value !== null;
};

export const getAuthErrorMessage = (error: unknown, action: AuthAction): string => {
    if (!error) return '';

    if (isSupabaseLikeError(error)) {
        const status = error.status;
        const message = error.message ?? '';

        if (action === 'login' && status === 400) {
            return 'Ogiltig mejladress eller lösenord.';
        }

        if (action === 'signup' && status === 422) {
            return 'Kontot finns redan, eller lösenordet uppfyller inte kraven.';
        }

        if (message) {
            return message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Ett okant fel intraffade.';
};