type PageProps = {
    searchParams: {
        email?: string;
    };
};

export default function UnsubscribePage({ searchParams }: PageProps) {
    const email = searchParams?.email ?? '';

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Impact Post
                    </p>
                    <h1 className="text-2xl font-bold text-gray-900">Unsubscribe</h1>
                    <p className="text-gray-600">
                        We&apos;re sorry to see you go. Confirm below to stop receiving Impact Post emails.
                    </p>
                </div>

                <form
                    className="space-y-4"
                    method="POST"
                    action="/api/email/unsubscribe"
                >
                    <label className="block text-sm font-medium text-gray-700">
                        Email address
                        <input
                            type="email"
                            name="email"
                            defaultValue={email}
                            required
                            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </label>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Confirm unsubscribe
                    </button>
                </form>

                <div className="text-sm text-gray-500 space-y-1">
                    <p>Need help? Email us at support@impactpost.ca.</p>
                    <p>If you didn&apos;t request this, you can safely ignore this page.</p>
                </div>
            </div>
        </main>
    );
}
