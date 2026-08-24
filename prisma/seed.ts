import bcrypt from 'bcryptjs';
import {
  CrewStatus,
  PrismaClient,
  UserRole,
  WorkOrderPriority,
  WorkOrderStatus,
} from '@prisma/client';

const prisma = new PrismaClient();
const titles = [
  'Streetlight inspection',
  'Fiber cabinet maintenance',
  'Water valve assessment',
  'Signal controller check',
  'Sidewalk safety review',
  'Drainage channel cleanup',
];
const addresses = [
  '14 Aurora Lane',
  '88 Meridian Avenue',
  '203 Harbor View Road',
  '51 Cedar Plaza',
  '7 Atlas Street',
  '329 Solstice Boulevard',
];

async function main() {
  await prisma.workOrder.deleteMany();
  await prisma.crew.deleteMany();
  await prisma.user.deleteMany();
  const hash = await bcrypt.hash('DemoPass123!', 12);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Avery Rowan',
        email: 'admin@workops.demo',
        password: hash,
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Morgan Vale',
        email: 'supervisor@workops.demo',
        password: hash,
        role: UserRole.SUPERVISOR,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Casey North',
        email: 'technician@workops.demo',
        password: hash,
        role: UserRole.TECHNICIAN,
      },
    }),
  ]);
  const crews = await Promise.all(
    [
      'Northstar Field Team',
      'Atlas Response Crew',
      'Harbor Operations Unit',
      'Cedar Maintenance Team',
      'Solstice Support Crew',
    ].map((name, index) =>
      prisma.crew.create({
        data: {
          name,
          supervisorId: users[1].id,
          status: index === 4 ? CrewStatus.INACTIVE : CrewStatus.ACTIVE,
        },
      }),
    ),
  );
  await prisma.workOrder.createMany({
    data: Array.from({ length: 30 }, (_, index) => {
      const status = [
        WorkOrderStatus.PENDING,
        WorkOrderStatus.ASSIGNED,
        WorkOrderStatus.IN_PROGRESS,
        WorkOrderStatus.COMPLETED,
        WorkOrderStatus.CANCELLED,
      ][index % 5];
      const createdAt = new Date(Date.UTC(2026, 6, 1 + index));
      return {
        orderNumber: `WO-2026-${String(index + 1).padStart(4, '0')}`,
        title: titles[index % titles.length],
        description: `Fictional operational task ${index + 1} for the WorkOps API portfolio demonstration.`,
        address: addresses[index % addresses.length],
        latitude: -0.1807 + index * 0.001,
        longitude: -78.4678 + index * 0.001,
        priority: [
          WorkOrderPriority.LOW,
          WorkOrderPriority.MEDIUM,
          WorkOrderPriority.HIGH,
          WorkOrderPriority.CRITICAL,
        ][index % 4],
        status,
        assignedCrewId:
          status === WorkOrderStatus.PENDING || status === WorkOrderStatus.CANCELLED
            ? null
            : crews[index % 4].id,
        createdAt,
        startedAt:
          status === WorkOrderStatus.IN_PROGRESS || status === WorkOrderStatus.COMPLETED
            ? new Date(createdAt.getTime() + 3_600_000)
            : null,
        completedAt:
          status === WorkOrderStatus.COMPLETED ? new Date(createdAt.getTime() + 7_200_000) : null,
      };
    }),
  });
  console.log('Seed complete: 3 users, 5 crews, 30 fictional work orders.');
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
