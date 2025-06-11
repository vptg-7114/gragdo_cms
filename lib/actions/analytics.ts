import { prisma } from "@/lib/prisma"

export async function getAnalyticsData() {
  try {
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      thisMonthRevenue,
      lastMonthRevenue,
      totalPatients,
      lastMonthPatients,
      totalAppointments,
      completedAppointments
    ] = await Promise.all([
      // This month revenue
      prisma.transaction.aggregate({
        where: {
          type: 'INCOME',
          createdAt: {
            gte: thisMonth
          }
        },
        _sum: {
          amount: true
        }
      }),
      // Last month revenue
      prisma.transaction.aggregate({
        where: {
          type: 'INCOME',
          createdAt: {
            gte: lastMonth,
            lte: lastMonthEnd
          }
        },
        _sum: {
          amount: true
        }
      }),
      // Total patients
      prisma.patient.count(),
      // Last month patients
      prisma.patient.count({
        where: {
          createdAt: {
            lt: thisMonth
          }
        }
      }),
      // Total appointments
      prisma.appointment.count(),
      // Completed appointments
      prisma.appointment.count({
        where: {
          status: 'COMPLETED'
        }
      })
    ])

    const thisMonthRevenueAmount = thisMonthRevenue._sum.amount || 0
    const lastMonthRevenueAmount = lastMonthRevenue._sum.amount || 0
    const revenueGrowth = lastMonthRevenueAmount > 0 
      ? Math.round(((thisMonthRevenueAmount - lastMonthRevenueAmount) / lastMonthRevenueAmount) * 100)
      : 0

    const patientGrowth = lastMonthPatients > 0
      ? Math.round(((totalPatients - lastMonthPatients) / lastMonthPatients) * 100)
      : 0

    const completionRate = totalAppointments > 0
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0

    return {
      revenue: {
        thisMonth: thisMonthRevenueAmount,
        lastMonth: lastMonthRevenueAmount,
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
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
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
    }
  }
}