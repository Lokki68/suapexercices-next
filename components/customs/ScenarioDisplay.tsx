import type {EvolutionStep, Scenario} from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import BilanDisplay from "@/components/customs/BilanDisplay";

interface ScenarioDisplayProps {
    scenario: Scenario
}

export default function ScenarioDisplay({scenario}: ScenarioDisplayProps) {

    return (
        <div className='grid md:grid-cols-2 gap-6'>
            <Card className='bg-gray-800/60 backdrop-blur border-gray-700'>
                <CardHeader>
                    <CardTitle className='text-xl text-red-400'>🧭 Situation</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className='h-[300px] pr-2'>
                        <p className="text-gray-200 leading-relaxed">
                            {scenario.situation}
                        </p>
                    </ScrollArea>
                    <Separator/>

                    <h3 className='font-semibold text-lg text-red-300 mb-1'>🎯 Objectif pédagogique</h3>
                    <p className="text-gray-100">{scenario.objectif_pedagoqique}</p>
                </CardContent>
            </Card>

            <Card className='bg-gray-800/60 backdrop-blur border-gray-700'>
                <CardHeader>
                    <CardTitle className='text-sl text-red-400'>📋 Constantes & Évolution</CardTitle>
                </CardHeader>
                <CardContent>
                    <BilanDisplay
                        title='Bilan Initial'
                        conscience={scenario.bilan_initial.conscience}
                        temp={scenario.bilan_initial.temp}
                        fc={scenario.bilan_initial.fc}
                        fr={scenario.bilan_initial.fr}
                        ta={scenario.bilan_initial.ta}
                        spo2={scenario.bilan_initial.spo2}

                    />

                    <Separator/>

                    <h4 className='font-semibold text-gray-200 mb-2'>Evolution</h4>
                    <ScrollArea className='h-[200px] pr-2'>
                        <ul className='space-y-3'>
                            {scenario.evolution.map((step: EvolutionStep, index: number) => (
                                <li key={index} className='border-l-4 border-red-500 pl-3'>
                                    <p className="text-gray-300">
                                        <strong>{step.minute} min :</strong>
                                    </p>
                                    <BilanDisplay
                                        fc={step.fc}
                                        fr={step.fr}
                                        ta={step.ta}
                                        spo2={step.spo2}
                                        description={step.description}
                                    />
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </CardContent>
            </Card>

        </div>
    )
}