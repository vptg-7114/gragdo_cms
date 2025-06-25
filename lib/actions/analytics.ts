import { readData } from '@/lib/db';

export async function getAnalyticsData() {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const transactions = await readData('transactions.json');
    const patients = await readData('patients.json');
    const appointments = await readData('appointments.json');
    
    // Calculate revenue
    const thisMonthRevenue = transactions
      .filter(t => 
        t.type === 'INCOME' && 
        new Date(t.createdAt) >= thisMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
      
    const lastMonthRevenue = transactions
      .filter(t => 
        t.type === 'INCOME' && 
        new Date(t.createdAt) >= lastMonth && 
        new Date(t.createdAt) <= lastMonthEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate growth
    const revenueGrowth = lastMonthRevenue > 0 
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;
    
    // Calculate patient growth
    const totalPatients = patients.length;
    const lastMonthPatients = patients.filter(
      p => new Date(p.createdAt) < thisMonth
    ).length;
    
    const patientGrowth = lastMonthPatients > 0
      ? Math.round(((totalPatients - lastMonthPatients) / lastMonthPatients) * 100)
      : 0;
    
    // Calculate appointment completion rate
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
      a => a.status === 'COMPLETED'
    ).length;
    
    const completionRate = totalAppointments > 0
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;
    
    return {
      revenue: {
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: revenueGrowth
      },
      patients: {
        total: totalPatients,
        growth: patientGrowth
      },
      appointments: {
        completionRate,
        total: totalAppointments
      }
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      revenue: {
        thisMonth: 0,
        lastMonth: 0,
        growth: 0
      },
      patients: {
        total: 0,
        growth: 0
      },
      appointments: {
        completionRate: 0,
        total: 0
      }
    };
  }
}