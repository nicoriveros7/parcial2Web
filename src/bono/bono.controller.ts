import { Controller } from '@nestjs/common';
import { BonoService } from './bono.service';

@Controller('bonos')
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}
}
