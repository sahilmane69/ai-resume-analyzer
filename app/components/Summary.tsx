import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
        : score > 49
            ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary !py-2">
            <div className="category !p-2">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-lg font-medium">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-lg font-bold">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-4">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold">Your Resume Score</h2>
                    <p className="text-xs text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content" score={feedback.content.score} />
            <Category title="Structure" score={feedback.structure.score} />
            <Category title="Skills" score={feedback.skills.score} />
        </div>
    )
}
export default Summary