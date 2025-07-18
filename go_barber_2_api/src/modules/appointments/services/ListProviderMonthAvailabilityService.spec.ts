import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it("should be able to list provider's month availability", async () => {
    const year = 2024;
    const month = 7; // July

    const appointmentsToCreate = [
      {
        date: new Date(year, month - 1, 5, 10, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'anything',
      },
      {
        date: new Date(year, month - 1, 10, 8, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'anything',
      },
      {
        date: new Date(year, month - 1, 10, 9, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'anything',
      },
      {
        date: new Date(year, month - 1, 10, 10, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 10, 11, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 10, 12, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 10, 13, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 10, 14, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 10, 15, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 10, 16, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 10, 17, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'any_user_id',
      },
      {
        date: new Date(year, month - 1, 12, 10, 0, 0),
        provider_id: 'any_provider_id',
        user_id: 'anything',
      },
    ];

    await Promise.all(
      appointmentsToCreate.map(async appointment => {
        await fakeAppointmentsRepository.create(appointment);
      }),
    );

    const monthAvailabilty = await listProviderMonthAvailabilityService.execute(
      {
        month,
        year,
        provider_id: 'any_provider_id',
      },
    );

    const expectedResultToContain = [
      {
        day: 8,
        available: true,
      },
      {
        day: 9,
        available: true,
      },
      {
        day: 10,
        available: false,
      },
      {
        day: 11,
        available: false,
      },
      {
        day: 12,
        available: true,
      },
    ];

    expect(monthAvailabilty).toEqual(
      expect.arrayContaining(expectedResultToContain),
    );
  });
});
