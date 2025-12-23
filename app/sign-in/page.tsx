import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 ' >
            <SignIn
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-red-600 hover:bg-red-700',
                        card: 'bg-gray-800 border border-gray-700'
                    }
                }}
            />
        </div>
    )
}