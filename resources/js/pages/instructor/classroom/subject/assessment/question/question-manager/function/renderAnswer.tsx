export const renderAnswers = (q: any) => {
    switch (q.type) {
        case 'true_false':
            return (
                <p>
                    Answer:{' '}
                    <strong className="text-green-500">{q.answer}</strong>
                </p>
            );
        case 'matching':
            return (
                <ul className="ml-4">
                    {q?.answer?.map((a: any, i: number) => {
                        // Convert index to letter (A, B, C, D, ...)
                        const letter = String.fromCharCode(65 + i);

                        return (
                            <li key={i}>
                                <span className="mr-2">{letter}.</span>
                                {a.left} →{' '}
                                <span className="text-green-500">
                                    {a.right}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            );
        case 'multiple_choice':
            return (
                <ul className="ml-4 list-disc">
                    {q?.options?.map((a: any, i: number) => {
                        // Handle both string and object formats
                        const text = typeof a === 'string' ? a : a.option_text;

                        // Convert index to letter (A, B, C, D, ...)
                        const letter = String.fromCharCode(65 + i);

                        return (
                            <li key={i} className="flex items-center">
                                <span className="mr-2">{letter}.</span>
                                {text === q?.answer ? (
                                    <span className="font-semibold text-green-500">
                                        {text}
                                    </span>
                                ) : (
                                    <span>{text}</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            );

        default:
            return (
                <p>
                    Answer:{' '}
                    <span className="text-green-500">
                        {JSON.stringify(q.answer)}
                    </span>
                </p>
            );
    }
};
