import type { CrewStatus } from '@prisma/client';
import { CrewRepository } from '../repositories/crew.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/app-error.js';

export class CrewService {
  private readonly crews = new CrewRepository();
  private readonly users = new UserRepository();
  list() {
    return this.crews.findAll();
  }
  async get(id: string) {
    const crew = await this.crews.findById(id);
    if (!crew) throw new AppError(404, 'Crew not found');
    return crew;
  }
  async create(data: { name: string; supervisorId?: string | null; status?: CrewStatus }) {
    await this.ensureSupervisor(data.supervisorId);
    return this.crews.create(data);
  }
  async update(
    id: string,
    data: { name?: string; supervisorId?: string | null; status?: CrewStatus },
  ) {
    await this.get(id);
    if (data.supervisorId !== undefined) await this.ensureSupervisor(data.supervisorId);
    return this.crews.update(id, data);
  }
  async remove(id: string) {
    await this.get(id);
    await this.crews.delete(id);
  }
  private async ensureSupervisor(id?: string | null) {
    if (!id) return;
    const user = await this.users.findById(id);
    if (!user) throw new AppError(400, 'Supervisor does not exist');
    if (user.role !== 'SUPERVISOR')
      throw new AppError(400, 'Assigned user must have SUPERVISOR role');
  }
}
