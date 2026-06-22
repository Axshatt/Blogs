import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSubscribers } from '@/lib/db';

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const format = searchParams.get('format'); // 'csv' or null/json

    const list = await getSubscribers(search);

    if (format === 'csv') {
      // Create CSV content
      const headers = ['ID', 'Email', 'Created At', 'Verified', 'Unsubscribed', 'Signup IP'];
      const rows = list.map((s) => [
        s.id,
        s.email,
        s.created_at,
        s.verified ? 'Yes' : 'No',
        s.unsubscribed ? 'Yes' : 'No',
        s.signup_ip || 'N/A',
      ]);

      const csvContent =
        [headers.join(',')].concat(rows.map((row) => row.map((val) => `"${val}"`).join(','))).join('\n');

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="subscribers_${new Date().toISOString().split('T')[0]}.csv"`,
          'Cache-Control': 'no-cache',
        },
      });
    }

    return NextResponse.json(list);
  } catch (error: any) {
    console.error('Admin Subscribers Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers.' }, { status: 500 });
  }
}
