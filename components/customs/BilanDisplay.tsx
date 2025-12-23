import {Card, CardContent, CardHeader} from "@/components/ui/card";

interface BilanDisplayProps {
    title?: string
    fc?: number
    fr?: number
    ta?: string
    spo2?: string
    temp?: string
    conscience?: string
    description?: string
}

export default function BilanDisplay({
                                         title,
                                         fc,
                                         fr,
                                         ta,
                                         spo2,
                                         temp,
                                         conscience,
                                         description
                                     }: BilanDisplayProps) {

    return (
        <Card className='bg-gray-800/60 backdrop-blur border-gray-700 text-gray-200'>
            {title && (
                <CardHeader>
                    <h4 className='font-semibold text-gray-200 mb-2'>{title}</h4>
                </CardHeader>
            )}
            <CardContent>
                {conscience && <p>Conscience: {conscience}</p>}
                <div className="flex gap-4 flex-wrap">
                    {fc && <p>Fc: {fc}</p>}
                    {fr && <p>Fr: {fr}</p>}
                    {ta && <p>Ta: {ta}</p>}
                    {spo2 && <p>Spo2: {spo2}</p>}
                    {temp && <p>Temp: {temp}</p>}
                </div>
                {description && <p>Description: {description}</p>}
            </CardContent>
        </Card>
    )
}