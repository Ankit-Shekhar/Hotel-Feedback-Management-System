import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function DashboardChart({
  title = 'Dashboard Chart',
  data = [],
  xKey = 'label',
  yKey = 'value',
  className = '',
}) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-secondary/90 p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-ivory">{title}</h3>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(248,246,241,0.08)" vertical={false} />
            <XAxis dataKey={xKey} stroke="rgba(248,246,241,0.45)" tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(248,246,241,0.45)" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#1C1C1C',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: 16,
                color: '#F8F6F1',
              }}
              labelStyle={{ color: '#D4AF37' }}
            />
            <Bar
              dataKey={yKey}
              fill="#D4AF37"
              radius={[12, 12, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default DashboardChart

