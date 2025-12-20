import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirect') || '/';

  // Security: Validate redirect is an internal path to prevent open redirect attacks
  // Must start with / but not // (protocol-relative URL) and not contain backslash
  const isInternalPath =
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//') &&
    !redirectTo.includes('\\');

  redirect(isInternalPath ? redirectTo : '/');
}
