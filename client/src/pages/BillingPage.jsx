import PageHeader from '../components/PageHeader';

const invoices = [
  { id: 'INV-3021', date: '2026-02-10', amount: '$42.00', status: 'Paid' },
  { id: 'INV-2983', date: '2026-01-29', amount: '$65.00', status: 'Paid' },
  { id: 'INV-2877', date: '2026-01-03', amount: '$120.00', status: 'Due' }
];

function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Billing"
        title="Transparent billing and payments"
        description="Invoices, insurance co-pays, self-pay breakdowns, and HSA/FSA friendly checkout."
      />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-5">
          <p className="section-title">Invoice History</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-2">Invoice</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-slate-100">
                    <td className="py-3">{invoice.id}</td>
                    <td className="py-3">{invoice.date}</td>
                    <td className="py-3">{invoice.amount}</td>
                    <td className="py-3">{invoice.status}</td>
                    <td className="py-3">
                      <button type="button" className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">Pay Balance</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Consultation Fee</span>
                <span>$90.00</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance Covered</span>
                <span>-$40.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
                <span>Co-pay (Stripe)</span>
                <span>$50.00</span>
              </div>
            </div>
            <button type="button" className="mt-4 w-full rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
              Pay with Card
            </button>
            <button type="button" className="mt-2 w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              Use HSA/FSA
            </button>
          </div>

          <div className="card p-5">
            <p className="section-title">Payment Plans</p>
            <p className="mt-2 text-sm text-slate-600">Split balances above $200 into monthly installments.</p>
            <div className="mt-3 grid gap-2 text-sm">
              <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-left">
                3 months • 0% APR
              </button>
              <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-left">
                6 months • 1.5% APR
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BillingPage;
