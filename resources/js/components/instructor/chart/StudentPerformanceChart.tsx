import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from 'recharts';

export default function StudentPerformanceChart({
  data,
}: {
  data: { student: { name: string }; status: string; score: string }[];
}) {
  const formattedData = data.map((item) => ({
    name: item.student?.name || 'Unknown',
    status: item.status,
    score: Number(item.score),
  }));

  const average = formattedData.reduce((sum, s) => sum + s.score, 0) / formattedData.length;
  const performance =
    average >= 80 ? 'Excellent' : average >= 60 ? 'Good' : average >= 40 ? 'Fair' : 'Poor';

  return (
    <div className="w-full py-2">
      <h2 className="text-center text-lg font-semibold">Student Performance</h2>

      <div className="h-80 w-full">
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={formattedData}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" hide /> {/* Hide Y-axis labels */}

            <Tooltip />

            {/* Vertical average line */}
            <ReferenceLine
              x={average}
              stroke="#facc15"
              strokeDasharray="3 3"
              label={{
                value: `Average: ${average.toFixed(1)}`,
                position: 'top',
                fill: '#facc15',
              }}
            />

            <Bar dataKey="score" barSize={35} radius={[0, 8, 8, 0]}>
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.score >= 75
                      ? '#4ade80' // green
                      : entry.score >= 50
                      ? '#60a5fa' // blue
                      : '#f87171' // red
                  }
                />
              ))}

              {/* Add student name inside the bar */}
              <LabelList
                dataKey="name"
                position="insideLeft"
                fill="#fff"
                fontSize={13}
                offset={10}
                style={{ fontWeight: 500 }}
              />

              {/* Optional: show score at the end of each bar */}
              <LabelList
                dataKey="score"
                position="right"
                fill="#333"
                fontSize={13}
                formatter={(v: number) => `${v}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>
          Average Score:{' '}
          <span className="font-semibold text-yellow-600">{average.toFixed(2)}</span>
        </p>
        <p>
          Overall Performance:{' '}
          <span
            className={`font-semibold ${
              performance === 'Excellent'
                ? 'text-green-600'
                : performance === 'Good'
                ? 'text-blue-600'
                : performance === 'Fair'
                ? 'text-orange-500'
                : 'text-red-600'
            }`}
          >
            {performance}
          </span>
        </p>
      </div>
    </div>
  );
}
