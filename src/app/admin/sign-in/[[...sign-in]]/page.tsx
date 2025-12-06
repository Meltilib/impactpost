import { SignIn } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="text-center">
        <h1 className="font-heavy text-4xl mb-2">IMPACT POST</h1>
        <p className="text-gray-600 mb-8">Admin Dashboard</p>
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'border-2 border-black shadow-hard',
              headerTitle: 'font-bold',
              primaryButton: 'bg-brand-purple hover:bg-brand-purple/90',
            },
          }}
        />
      </div>
    </div>
  );
}
