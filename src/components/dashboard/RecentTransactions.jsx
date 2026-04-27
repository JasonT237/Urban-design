export default function RecentTransactions({ transactions }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">
          Recent Transactions
        </h2>
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
          Filter
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}

function TransactionRow({ transaction }) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.25rem] border border-slate-200 bg-[#F7F8F0] p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-semibold text-slate-900">{transaction.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{transaction.date}</p>
      </div>

      <div className="flex items-center gap-4">
        <p className="font-semibold text-slate-900">{transaction.amount}</p>
        <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
          Receipt
        </button>
      </div>
    </div>
  );
}
