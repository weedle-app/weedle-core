import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NFTMintSignaturesDTO } from '../data-objects/data-signatures.dto';
import { Wallet, utils } from 'ethers';
import { plainToInstance } from 'class-transformer';
import ApiAccessKeysRepository from '../../auth/repositories/api-access-keys.repository';

@Injectable()
export class ContractsService {
  constructor(
    private readonly apiAccessKeysRepository: ApiAccessKeysRepository,
  ) {}

  private getMintingSignature = async (
    contractOwner: Wallet,
    typesToSign: string[],
    dataToSign: string[],
  ): Promise<{ hash: string; signature: string }> => {
    const message = utils.defaultAbiCoder.encode(typesToSign, dataToSign);

    const hash = utils.keccak256(message);
    const signature = await contractOwner.signMessage(utils.arrayify(hash));

    return { hash, signature };
  };

  async signNFTMintingTransaction(
    {
      contractAddress,
      userWalletAddress,
    }: {
      userWalletAddress: string;
      contractAddress: string;
    },
    apiKey: string,
  ): Promise<NFTMintSignaturesDTO> {
    if (!apiKey) {
      throw new UnauthorizedException();
    }

    const apiKeyData = await this.apiAccessKeysRepository.fetchByApiKey(apiKey);
    if (!apiKeyData) {
      throw new UnauthorizedException();
    }
    const contractOwner = new Wallet(process.env.NFT_ADMIN_PRIVATE_KEY);
    const { hash, signature } = await this.getMintingSignature(
      contractOwner,
      ['address', 'address', 'address'],
      [userWalletAddress, contractOwner.address, contractAddress],
    );

    return plainToInstance(
      NFTMintSignaturesDTO,
      { hash, signature },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
