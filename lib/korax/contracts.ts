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
];

export const projectFactoryAbi = [
  "function availableProjectSlots(address user) view returns (uint256)",
  "function projectsUsedByOwner(address user) view returns (uint256)",
  "function registerExistingProject((string name,string symbol,address token,address presale,address staking,address vault,string metadataURI) cfg) returns (uint256 projectId)",
];

export const projectRegistryAbi = [
  "function getOwnerProjects(address owner) view returns (uint256[] memory)",
  "function getProject(uint256 projectId) view returns (tuple(uint256 id,address owner,string name,string symbol,address token,address presale,address staking,address vault,string metadataURI,uint256 createdAt,bool active))",
];

export const aiDeployerAbi = [
  "function deployAIProject((string name,string symbol,uint256 totalSupply,bool stakingEnabled,uint256 stakingRewardsAllocation,string metadataURI) cfg) returns (uint256 projectId,address token,address vault,address staking)",
  "function availableProjectSlots(address user) view returns (uint256)",
  "function projectsUsedByOwner(address user) view returns (uint256)",
  "function accessManager() view returns (address)",
  "function registry() view returns (address)",
  "function setAccessManager(address newAccessManager)",
  "function setRegistry(address newRegistry)",
  "event AIProjectDeployed(uint256 indexed projectId,address indexed owner,address indexed token,address vault,address staking,string name,string symbol)",
];

export const launchpadAbi = [
  "function createSale(address saleToken,address paymentToken,uint256 totalForSale,uint256 pricePerToken,uint256 hardCap,uint256 baseMaxContribution,uint256 contributionPerLevel,bool requireKoraxAccess) returns (uint256 saleId)",

  "function launchLevelOf(address user) view returns (uint8)",
  "function maxContributionOf(uint256 saleId,address user) view returns (uint256)",

  "function buyWithBNB(uint256 saleId) payable",
  "function buyWithToken(uint256 saleId,uint256 paymentAmount)",

  "function closeSale(uint256 saleId)",
  "function setClaimOpen(uint256 saleId,bool open)",
  "function claim(uint256 saleId)",

  "function withdrawFunds(uint256 saleId,address payable to)",
  "function withdrawUnsold(uint256 saleId,address to)",

  "function setSaleCreatorApproval(address account,bool approved)",
  "function setAccessManager(address newAccessManager)",

  "function sales(uint256) view returns (address owner,address saleToken,address paymentToken,uint8 saleTokenDecimals,uint256 totalForSale,uint256 pricePerToken,uint256 hardCap,uint256 baseMaxContribution,uint256 contributionPerLevel,uint256 raised,uint256 sold,bool active,bool claimOpen,bool requireKoraxAccess)",
  "function contributed(uint256,address) view returns (uint256)",
  "function purchased(uint256,address) view returns (uint256)",
  "function claimed(uint256,address) view returns (bool)",
  "function nextSaleId() view returns (uint256)",

  "event AccessManagerUpdated(address indexed oldAccessManager,address indexed newAccessManager)",
  "event SaleCreatorApproved(address indexed account,bool approved)",
  "event SaleCreated(uint256 indexed saleId,address indexed owner,address indexed saleToken,address paymentToken)",
  "event Bought(uint256 indexed saleId,address indexed buyer,uint256 paymentAmount,uint256 tokenAmount)",
  "event SaleClosed(uint256 indexed saleId)",
  "event ClaimStatusUpdated(uint256 indexed saleId,bool open)",
  "event Claimed(uint256 indexed saleId,address indexed user,uint256 amount)",
  "event FundsWithdrawn(uint256 indexed saleId,address indexed to,uint256 amount)",
  "event UnsoldWithdrawn(uint256 indexed saleId,address indexed to,uint256 amount)",
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