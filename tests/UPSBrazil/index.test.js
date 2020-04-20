import UPSBrazilCalculateQuote from '../../src';

test('call simulateQuote and check response', async () => {
  const response = await UPSBrazilCalculateQuote(
    process.env.API_USER,
    process.env.API_PASSWORD,
    '12608220',
    '28695000',
    {
      height: 11,
      length: 20,
      width: 30,
      weight: 0.14,
    },
    200,
    20000,
  );

  console.log(response);
  expect(response).toBeTruthy();
}, 30000);
