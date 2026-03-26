import { PrismaClient, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando população do banco de dados...');

  const password = await bcrypt.hash('password', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@acme.com',
      password: password
    }
  });

  console.log('Usuário criado com sucesso.');

  const customer_data = [{
    name: 'Wallace Duarte',
    email: 'wallace@email.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Wallace+Duarte&background=random'
  }, {
    name: 'Daniele Duarte',
    email: 'daniele@email.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Daniele+Duarte&background=random'
  }, {
    name: 'Cristine Elaine',
    email: 'cristine@email.com',
    imageUrl: 'https://ui-avatars.com/api/?name=Cristine+Elaine&background=random'
  }];

  const customers = [];

  for (const data of customer_data) {
    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {},
      create: data
    });

    customers.push(customer);
    console.log(`Cliente criado: ${customer.name}`);
  };

  const invoicesData = [{
    amount: 15781,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-29',
    customer: customers[0]
  }, {
    amount: 15782,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-15',
    customer: customers[1]
  }, {
    amount: 157813,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-12',
    customer: customers[2]
  }, {
    amount: 15784,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-15',
    customer: customers[0]
  }, {
    amount: 15785,
    status: InvoiceStatus.PAGO,
    date: '2026-05-05',
    customer: customers[1]
  }, {
    amount: 15786,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-16',
    customer: customers[2]
  }, {
    amount: 15787,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-17',
    customer: customers[0]
  }, {
    amount: 15788,
    status: InvoiceStatus.PAGO,
    date: '2026-05-03',
    customer: customers[1]
  }, {
    amount: 15789,
    status: InvoiceStatus.PAGO,
    date: '2026-05-01',
    customer: customers[2]
  }, {
    amount: 157810,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-20',
    customer: customers[0]
  }, {
    amount: 157811,
    status: InvoiceStatus.PAGO,
    date: '2026-05-08',
    customer: customers[1]
  }, {
    amount: 157812,
    status: InvoiceStatus.PENDENTE,
    date: '2026-05-21',
    customer: customers[2]
  }];

  for (const data of invoicesData) {
    await prisma.invoice.create({
      data: {
        amount: data.amount,
        status: data.status,
        date: new Date(data.date),
        customerId: data.customer.id
      }
    });
  };

  console.log(`${invoicesData.length} faturas criadas.`);

  const revenueData = [
    { month: 'Jan', revenue: 65748461 },
    { month: 'Fev', revenue: 69562131 },
    { month: 'Mar', revenue: 8556565 },
    { month: 'Abr', revenue: 95653 },
    { month: 'Mai', revenue: 9756232 },
    { month: 'Jun', revenue: 98465103 },
    { month: 'Jul', revenue: 1541656 },
    { month: 'Ago', revenue: 8979613 },
    { month: 'Set', revenue: 784152103 },
    { month: 'Out', revenue: 3265232 },
    { month: 'Nov', revenue: 1656566565 },
    { month: 'Dez', revenue: 646562266 },
  ];

  for (const data of revenueData) {
    await prisma.revenue.upsert({
      where: { month: data.month },
      update: { revenue: data.revenue },
      create: data
    });
  };

  console.log('Dados de receita mensal criados.');

  console.log('População concluída com sucesso.');
};

main()
  .catch((erro) => {
    console.log('Erro ao popular o banco:', erro);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });