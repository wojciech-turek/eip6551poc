import { BigNumber, ethers } from 'ethers';

export const signClaimNote = async (
  receiver: string,
  giveawayId: number,
  amount: BigNumber
) => {
  if (!process.env.PRIVATE_KEY)
    throw new Error('PRIVATE_KEY is not defined in .env file');
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  const hash = ethers.utils.solidityKeccak256(
    ['address', 'uint256', 'uint256'],
    [receiver, giveawayId, amount]
  );
  const messageBytes = ethers.utils.arrayify(hash);
  const signature = await signer.signMessage(messageBytes);

  return signature;
};
