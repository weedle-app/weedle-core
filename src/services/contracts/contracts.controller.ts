import { Request, Controller, Post } from '@nestjs/common';
import { ContractsService } from './logic/contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post('nft/sign-mint-transaction')
  async fetchApiKeyById(@Request() req) {
    return this.contractsService.signNFTMintingTransaction(
      req.body,
      req.headers.apikey,
    );
  }
}
