import {Card, CardContent} from "@/components/ui/card";

interface ErrorDisplayProps {
    error: string
}

export default function ErrorDisplay({error}: ErrorDisplayProps) {
    return (
        <Card className="bg-red-500/30 backdrop-blur border-red-900/30 mt-auto" >
            <CardContent>
                <p className='text-red-300 text-center font-medium py-2'>
                    {error}
                </p>
            </CardContent>
        </Card>
    )
}