import { ethers } from "ethers";

export const BSC_CHAIN_ID = 56;

export const RPC_URL =
  process.env.NEXT_PUBLIC_BSC_RPC_URL || "https://bsc-dataseed.binance.org/";

export const ACCESS_MANAGER_ADDRESS =
  process.env.NEXT_PUBLIC_ACCESS_MANAGER_ADDRESS || "";

export const PROJECT_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_PROJECT_REGISTRY_ADDRESS || "";

export const PROJECT_FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_PROJECT_FACTORY_ADDRESS || "";

export const AI_DEPLOYER_ADDRESS =
  process.env.NEXT_PUBLIC_AI_DEPLOYER_ADDRESS || "";

export const LAUNCHPAD_ADDRESS =
  process.env.NEXT_PUBLIC_LAUNCHPAD_ADDRESS || "";

export const USDT_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_ADDRESS ||
  "0x55d398326f99059fF775485246999027B3197955";

export const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

export const NATIVE_BNB_ADDRESS = ethers.ZeroAddress;

export const accessManagerAbi = [
  "function staking() view returns (address)",
  "function tokensPerProject() view returns (uint256)",
  "function requiredRewardBps() view returns (uint256)",
  "function launchLevel1Amount() view returns (uint256)",
  "function launchLevel2Amount() view returns (uint256)",
  "function launchLevel3Amount() view returns (uint256)",

  "function getEligibleStakedAmount(address user) view returns (uint256 totalEligibleAmount)",
  "function getProjectSlots(address user) view returns (uint256)",
  "function hasKoraxAccess(address user) view returns (bool)",

  "function getLaunchLevel(address user) view returns (uint8)",
  "function hasLaunchAccess(address user) view returns (bool)",

  "function getAccessData(address user) view returns (uint256 totalEligibleAmount,uint256 totalProjectSlots,uint256 currentTokensPerProject,uint256 currentRequiredRewardBps)",
  "function getLaunchAccessData(address user) view returns (uint256 totalEligibleAmount,uint8 launchLevel,uint256 level1Amount,uint256 level2Amount,uint256 level3Amount,uint256 currentRequiredRewardBps)",

  "function setStakingAddress(address newStaking)",
  "function setTokensPerProject(uint256 newAmount)",
  "function setRequiredRewardBps(uint256 newRewardBps)",
  "function setLaunchLevels(uint256 level1Amount,uint256 level2Amount,uint256 level3Amount)",

  "event StakingAddressUpdated(address indexed oldStaking,address indexed newStaking)",
  "event TokensPerProjectUpdated(uint256 oldAmount,uint256 newAmount)",
  "event RequiredRewardBpsUpdated(uint256 oldBps,uint256 newBps)",
  "event LaunchLevelsUpdated(uint256 level1Amount,uint256 level2Amount,uint256 level3Amount)",
];

export const projectRegistryAbi = [
  "function owner() view returns (address)",
  "function nextProjectId() view returns (uint256)",

  "function authorizedFactories(address factory) view returns (bool)",
  "function ownerProjects(address owner,uint256 index) view returns (uint256)",
  "function projects(uint256 projectId) view returns (uint256 id,address owner,string name,string symbol,address token,address presale,address staking,address vault,string metadataURI,uint256 createdAt,bool active)",

  "function getOwnerProjects(address owner) view returns (uint256[] memory)",
  "function getProject(uint256 projectId) view returns (tuple(uint256 id,address owner,string name,string symbol,address token,address presale,address staking,address vault,string metadataURI,uint256 createdAt,bool active))",

  "function setFactoryAuthorization(address factory,bool authorized)",

  "event FactoryAuthorized(address indexed factory,bool authorized)",
  "event ProjectRegistered(uint256 indexed projectId,address indexed owner,string name,string symbol,address token,address presale,address staking,address vault,string metadataURI)",
];

export const projectFactoryAbi = [
  "function owner() view returns (address)",

  "function accessManager() view returns (address)",
  "function registry() view returns (address)",

  "function MAX_NAME_LENGTH() view returns (uint256)",
  "function MAX_SYMBOL_LENGTH() view returns (uint256)",
  "function MAX_METADATA_LENGTH() view returns (uint256)",

  "function projectsUsedByOwner(address user) view returns (uint256)",
  "function availableProjectSlots(address user) view returns (uint256)",

  "function registerExistingProject((string name,string symbol,address token,address presale,address staking,address vault,string metadataURI) cfg) returns (uint256 projectId)",

  "function setAccessManager(address newAccessManager)",
  "function setRegistry(address newRegistry)",

  "event AccessManagerUpdated(address indexed oldAccessManager,address indexed newAccessManager)",
  "event RegistryUpdated(address indexed oldRegistry,address indexed newRegistry)",
  "event ExistingProjectRegistered(uint256 indexed projectId,address indexed owner,string name,string symbol,address token,address presale,address staking,address vault)",
];

export const aiDeployerAbi = [
  "function deployAIProject(((string name,string symbol,uint256 initialSupply,uint256 maxSupply,bool mintable,bool burnable) token,bool stakingEnabled,uint256 stakingRewardsAllocation,string metadataURI,(uint256 durationDays,uint256 rewardBps)[] stakingPlans) cfg) returns (uint256 projectId,address token,address vault,address staking)",

  "function availableProjectSlots(address user) view returns (uint256)",
  "function projectsUsedByOwner(address user) view returns (uint256)",

  "function accessManager() view returns (address)",
  "function registry() view returns (address)",

  "function PROJECT() view returns (string)",
  "function MODULE() view returns (string)",
  "function BUILD() view returns (uint256)",

  "function MAX_NAME_LENGTH() view returns (uint256)",
  "function MAX_SYMBOL_LENGTH() view returns (uint256)",
  "function MAX_METADATA_LENGTH() view returns (uint256)",
  "function MAX_PLANS() view returns (uint256)",
  "function MIN_DURATION_DAYS() view returns (uint256)",
  "function MAX_DURATION_DAYS() view returns (uint256)",
  "function MAX_REWARD_BPS() view returns (uint256)",

  "function setAccessManager(address newAccessManager)",
  "function setRegistry(address newRegistry)",

  "event AccessManagerUpdated(address indexed oldAccessManager,address indexed newAccessManager)",
  "event RegistryUpdated(address indexed oldRegistry,address indexed newRegistry)",
  "event AIProjectDeployed(uint256 indexed projectId,address indexed owner,address indexed token,address vault,address staking,string name,string symbol,string metadataURI)",
];

export const launchpadAbi = [
  "function owner() view returns (address)",

  "function USDT() view returns (address)",
  "function USDC() view returns (address)",
  "function USDT_DECIMALS() view returns (uint8)",
  "function USDC_DECIMALS() view returns (uint8)",
  "function accessManager() view returns (address)",

  "function level1ContributionLimitUsd18() view returns (uint256)",
  "function level2ContributionLimitUsd18() view returns (uint256)",
  "function level3ContributionLimitUsd18() view returns (uint256)",

  "function approvedSaleCreators(address account) view returns (bool)",
  "function antiBotEnabled() view returns (bool)",
  "function buyCooldown() view returns (uint256)",
  "function nextSaleId() view returns (uint256)",

  "function createSale(address saleToken,address fundReceiver,uint256[] stageCaps,uint256[] stagePricesUsd18,bool requireKoraxAccess) returns (uint256 saleId)",

  "function stagesCount(uint256 saleId) view returns (uint256)",
  "function getStage(uint256 saleId,uint256 index) view returns (tuple(uint256 cap,uint256 priceUsd18,uint256 sold))",
  "function currentStage(uint256 saleId) view returns (uint256)",
  "function stageRemaining(uint256 saleId,uint256 idx) view returns (uint256)",

  "function maxContributionOf(uint256 saleId,address user) view returns (uint256)",

  "function previewTokensForUSDT(uint256 saleId,uint256 amount) view returns (uint256 tokensOut)",
  "function previewTokensForUSDC(uint256 saleId,uint256 amount) view returns (uint256 tokensOut)",

  "function buyWithUSDT(uint256 saleId,uint256 amount)",
  "function buyWithUSDC(uint256 saleId,uint256 amount)",

  "function closeSale(uint256 saleId)",
  "function setClaimOpen(uint256 saleId,bool open)",
  "function claim(uint256 saleId)",
  "function withdrawUnsold(uint256 saleId,address to)",

  "function setSaleCreatorApproval(address account,bool approved)",
  "function setAccessManager(address newAccessManager)",
  "function setAntiBot(bool enabled,uint256 cooldownSeconds)",
  "function setContributionLimits(uint256 level1Usd18,uint256 level2Usd18,uint256 level3Usd18)",

  "function sales(uint256 saleId) view returns (address owner,address saleToken,address fundReceiver,uint8 saleTokenDecimals,uint256 totalForSale,uint256 totalSold,bool active,bool claimOpen,bool requireKoraxAccess)",
  "function contributedUsd18(uint256 saleId,address user) view returns (uint256)",
  "function purchased(uint256 saleId,address user) view returns (uint256)",
  "function claimed(uint256 saleId,address user) view returns (bool)",
  "function lastBuyAt(uint256 saleId,address user) view returns (uint256)",

  "event SaleCreatorApproved(address indexed account,bool approved)",
  "event AccessManagerUpdated(address indexed oldAccessManager,address indexed newAccessManager)",
  "event AntiBotUpdated(bool enabled,uint256 cooldown)",
  "event ContributionLimitsUpdated(uint256 level1,uint256 level2,uint256 level3)",
  "event SaleCreated(uint256 indexed saleId,address indexed owner,address indexed saleToken,address fundReceiver,uint256 totalForSale)",
  "event Bought(uint256 indexed saleId,address indexed buyer,string paymentToken,uint256 paymentAmount,uint256 usdValue18,uint256 tokenAmount)",
  "event SaleClosed(uint256 indexed saleId)",
  "event ClaimStatusUpdated(uint256 indexed saleId,bool open)",
  "event Claimed(uint256 indexed saleId,address indexed user,uint256 amount)",
  "event UnsoldWithdrawn(uint256 indexed saleId,address indexed to,uint256 amount)",
];

export const aiTokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function mintable() view returns (bool)",
  "function burnable() view returns (bool)",
  "function createdAt() view returns (uint256)",

  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner,address spender) view returns (uint256)",
  "function approve(address spender,uint256 amount) returns (bool)",
  "function transfer(address to,uint256 amount) returns (bool)",

  "function mint(address to,uint256 amount)",
  "function burn(uint256 amount)",
  "function owner() view returns (address)",

  "event Minted(address indexed to,uint256 amount)",
  "event Burned(address indexed from,uint256 amount)",
];

export const aiStakingAbi = [
  "function token() view returns (address)",
  "function vault() view returns (address)",
  "function totalStaked() view returns (uint256)",
  "function reservedRewards() view returns (uint256)",

  "function plansCount() view returns (uint256)",
  "function getPlan(uint256 planId) view returns (tuple(uint256 duration,uint256 rewardBps,bool active))",
  "function setPlanActive(uint256 planId,bool active)",

  "function positionsCount(address user) view returns (uint256)",
  "function getPosition(address user,uint256 index) view returns (tuple(uint256 amount,uint256 unlockTime,uint256 rewardBps,uint256 rewardReserved,bool withdrawn))",
  "function rewardOf(address user,uint256 index) view returns (uint256)",

  "function availableRewardCapacity() view returns (uint256)",
  "function canStake(uint256 amount,uint256 planId) view returns (bool)",
  "function stake(uint256 amount,uint256 planId)",
  "function withdraw(uint256 index)",

  "function owner() view returns (address)",

  "event PlanCreated(uint256 indexed planId,uint256 duration,uint256 rewardBps)",
  "event PlanStatusUpdated(uint256 indexed planId,bool active)",
  "event Staked(address indexed user,uint256 indexed index,uint256 indexed planId,uint256 amount,uint256 unlockTime,uint256 rewardBps,uint256 rewardReserved)",
  "event Withdrawn(address indexed user,uint256 indexed index,uint256 amount,uint256 rewardRequested,uint256 rewardPaid)",
];

export const aiVaultAbi = [
  "function token() view returns (address)",
  "function staking() view returns (address)",
  "function reservedForStaking() view returns (uint256)",
  "function availableForOwnerWithdraw() view returns (uint256)",

  "function setStaking(address staking_)",
  "function pullForStaking(address to,uint256 amount)",
  "function ownerWithdraw(address to,uint256 amount)",

  "function owner() view returns (address)",

  "event StakingSet(address indexed staking)",
  "event PulledForStaking(address indexed to,uint256 amount)",
  "event OwnerWithdraw(address indexed to,uint256 amount)",
];

export const erc20Abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner,address spender) view returns (uint256)",
  "function approve(address spender,uint256 amount) returns (bool)",
  "function transfer(address to,uint256 amount) returns (bool)",
];

export function getRpcProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function hasAddress(value: string) {
  return Boolean(value && ethers.isAddress(value));
}

export function getExplorerAddressUrl(address: string) {
  if (!hasAddress(address)) return "";
  return `https://bscscan.com/address/${address}`;
}

export function getExplorerTxUrl(txHash: string) {
  if (!txHash) return "";
  return `https://bscscan.com/tx/${txHash}`;
}