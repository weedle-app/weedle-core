import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ContractsService } from './logic/contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('nft/sign-mint-transaction')
  async fetchApiKeyById(@Body() body) {
    return this.contractsService.signNFTMintingTransaction(body);
  }
}
