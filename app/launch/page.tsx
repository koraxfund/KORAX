"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import {
  ACCESS_MANAGER_ADDRESS,
  LAUNCHPAD_ADDRESS,
  RPC_URL,
  USDT_ADDRESS,
  USDC_ADDRESS,
  accessManagerAbi,
  launchpadAbi,
  erc20Abi,
} from "@/lib/korax/contracts";

const LEVELS = [
  {
    name: "Level 1",
    label: "Basic Access",
    minKrx: 500,
    maxUsd: 250,
    level: 1,
    desc: "Entry access for KORAX launch participation.",
  },
  {
    name: "Level 2",
    label: "Strong Access",
    minKrx: 2500,
    maxUsd: 500,
    level: 2,
    desc: "Higher allocation power for committed KRX holders.",
  },
  {
    name: "Level 3",
    label: "Priority Access",
    minKrx: 5000,
    maxUsd: 750,
    level: 3,
    desc: "Priority participation with the highest launch allocation.",
  },
];

type AccessState = {
  loading: boolean;
  connected: boolean;
  wallet: string;
  eligibleAmount: string;
  launchLevel: number;
  totalProjectSlots: number;
  hasLaunchAccess: boolean;
  level1Amount: string;
  level2Amount: string;
  level3Amount: string;
  requiredRewardBps: number;
  error: string;
};

type LoadedStage = {
  cap: bigint;
  priceUsd18: bigint;
  sold: bigint;
};

type LoadedSale = {
  owner: string;
  saleToken: string;
  fundReceiver: string;
  saleTokenDecimals: number;
  totalForSale: bigint;
  totalSold: bigint;
  active: boolean;
  claimOpen: boolean;
  requireKoraxAccess: boolean;
  stages: LoadedStage[];
};

type LoadedBuilderProject = {
  projectName?: string;
  symbol?: string;
  category?: string;
  shortDescription?: string;
  targetAudience?: string;
  network?: string;

  tokenAddress?: string;
  vaultAddress?: string;
  stakingAddress?: string;
  launchpadAddress?: string;

  websiteName?: string;
  websiteSummary?: string;
  websiteGenerated?: boolean;

  txHash?: string;
};

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUnitsSafe(value: bigint, decimals = 18, max = 6) {
  try {
    return Number(ethers.formatUnits(value, decimals)).toLocaleString("en-US", {
      maximumFractionDigits: max,
    });
  } catch {
    return "0";
  }
}

function levelFromNumber(level: number) {
  if (level >= 3) return LEVELS[2];
  if (level >= 2) return LEVELS[1];
  if (level >= 1) return LEVELS[0];
  return null;
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function readLastBuilderProject(): LoadedBuilderProject | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem("korax_last_project");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object") {
      return parsed as LoadedBuilderProject;
    }

    return null;
  } catch {
    return null;
  }
}

export default function LaunchPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [loadedBuilderProject, setLoadedBuilderProject] =
    useState<LoadedBuilderProject | null>(null);

  const [isLaunchpadOwner, setIsLaunchpadOwner] = useState(false);
  const [isApprovedCreator, setIsApprovedCreator] = useState(false);

  const [access, setAccess] = useState<AccessState>({
    loading: false,
    connected: false,
    wallet: "",
    eligibleAmount: "0",
    launchLevel: 0,
    totalProjectSlots: 0,
    hasLaunchAccess: false,
    level1Amount: "500",
    level2Amount: "2,500",
    level3Amount: "5,000",
    requiredRewardBps: 9000,
    error: "",
  });

  const currentLevel = useMemo(
    () => levelFromNumber(access.launchLevel),
    [access.launchLevel]
  );

  const canCreateSale = isLaunchpadOwner || isApprovedCreator;

  const [creatorForm, setCreatorForm] = useState({
    saleToken: "",
    fundReceiver: "",
    stageCaps: "1000000\n1000000\n1000000",
    stagePricesUsd: "0.01\n0.015\n0.02",
    requireKoraxAccess: true,
  });

  useEffect(() => {
    const project = readLastBuilderProject();

    if (!project) return;

    setLoadedBuilderProject(project);

    setCreatorForm((prev) => ({
      ...prev,
      saleToken: project.tokenAddress || prev.saleToken,
    }));
  }, []);

  const [adminForm, setAdminForm] = useState({
    saleId: "0",
    creatorAddress: "",
    approved: true,
    claimOpen: true,
    unsoldReceiver: "",
    level1Limit: "250",
    level2Limit: "500",
    level3Limit: "750",
    antiBotEnabled: true,
    cooldown: "15",
  });

  const [creatorStatus, setCreatorStatus] = useState("");
  const [adminStatus, setAdminStatus] = useState("");
  const [creatingSale, setCreatingSale] = useState(false);
  const [adminBusy, setAdminBusy] = useState(false);

  const [buyerForm, setBuyerForm] = useState({
    saleId: "0",
    paymentAmount: "10",
    payToken: "USDT",
  });

  const [loadedSale, setLoadedSale] = useState<LoadedSale | null>(null);
  const [buyerMax, setBuyerMax] = useState<bigint>(0n);
  const [buyerPurchased, setBuyerPurchased] = useState<bigint>(0n);
  const [buyerContributed, setBuyerContributed] = useState<bigint>(0n);
  const [buyerClaimed, setBuyerClaimed] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<bigint>(0n);

  const [buyerStatus, setBuyerStatus] = useState("");
  const [loadingSale, setLoadingSale] = useState(false);
  const [buying, setBuying] = useState(false);
  const [claiming, setClaiming] = useState(false);

  async function getBrowserSigner() {
    if (!isConnected || !address) {
      throw new Error("Connect wallet first.");
    }

    if (!walletClient) {
      throw new Error("Wallet client not ready.");
    }

    const browserProvider = new ethers.BrowserProvider(
      walletClient.transport as any
    );

    return browserProvider.getSigner();
  }

  async function getSaleTokenDecimals(saleToken: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const token = new ethers.Contract(saleToken, erc20Abi, provider);
    return Number(await token.decimals());
  }

  async function loadLaunchpadPermissions(user?: string) {
    try {
      if (!user || !LAUNCHPAD_ADDRESS) {
        setIsLaunchpadOwner(false);
        setIsApprovedCreator(false);
        return;
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const [ownerRaw, approvedRaw] = await Promise.all([
        launchpad.owner(),
        launchpad.approvedSaleCreators(user),
      ]);

      setIsLaunchpadOwner(ownerRaw.toLowerCase() === user.toLowerCase());
      setIsApprovedCreator(Boolean(approvedRaw));
    } catch {
      setIsLaunchpadOwner(false);
      setIsApprovedCreator(false);
    }
  }

  async function loadAccess(user?: string) {
    if (!user) {
      setAccess({
        loading: false,
        connected: false,
        wallet: "",
        eligibleAmount: "0",
        launchLevel: 0,
        totalProjectSlots: 0,
        hasLaunchAccess: false,
        level1Amount: "500",
        level2Amount: "2,500",
        level3Amount: "5,000",
        requiredRewardBps: 9000,
        error: "",
      });
      return;
    }

    try {
      setAccess((prev) => ({
        ...prev,
        loading: true,
        connected: true,
        wallet: user,
        error: "",
      }));

      if (!ACCESS_MANAGER_ADDRESS) {
        throw new Error("Access manager address is missing.");
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const accessManager = new ethers.Contract(
        ACCESS_MANAGER_ADDRESS,
        accessManagerAbi,
        provider
      );

      const [launchData, accessData, hasLaunchAccessRaw] = await Promise.all([
        accessManager.getLaunchAccessData(user),
        accessManager.getAccessData(user),
        accessManager.hasLaunchAccess(user),
      ]);

      const eligibleBig = BigInt(launchData.totalEligibleAmount.toString());

      setAccess({
        loading: false,
        connected: true,
        wallet: user,
        eligibleAmount: Number(ethers.formatUnits(eligibleBig, 18)).toLocaleString(
          "en-US",
          { maximumFractionDigits: 4 }
        ),
        launchLevel: Number(launchData.launchLevel),
        totalProjectSlots: Number(accessData.totalProjectSlots),
        hasLaunchAccess: Boolean(hasLaunchAccessRaw),
        level1Amount: Number(
          ethers.formatUnits(BigInt(launchData.level1Amount.toString()), 18)
        ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
        level2Amount: Number(
          ethers.formatUnits(BigInt(launchData.level2Amount.toString()), 18)
        ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
        level3Amount: Number(
          ethers.formatUnits(BigInt(launchData.level3Amount.toString()), 18)
        ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
        requiredRewardBps: Number(launchData.currentRequiredRewardBps),
        error: "",
      });
    } catch (err: any) {
      setAccess((prev) => ({
        ...prev,
        loading: false,
        connected: true,
        wallet: user,
        error: err?.shortMessage || err?.message || "Failed to load access.",
      }));
    }
  }

  useEffect(() => {
    if (!address || !isConnected) {
      loadAccess(undefined);
      loadLaunchpadPermissions(undefined);
      return;
    }

    loadAccess(address);
    loadLaunchpadPermissions(address);
  }, [address, isConnected]);

  async function createSale() {
    setCreatingSale(true);
    setCreatorStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

      if (!creatorForm.saleToken.trim()) {
        throw new Error("Sale token address is required.");
      }

      const signer = await getBrowserSigner();
      const owner = await signer.getAddress();

      const saleTokenAddress = ethers.getAddress(creatorForm.saleToken.trim());
      const fundReceiver = creatorForm.fundReceiver.trim()
        ? ethers.getAddress(creatorForm.fundReceiver.trim())
        : owner;

      const saleDecimals = await getSaleTokenDecimals(saleTokenAddress);

      const caps = parseLines(creatorForm.stageCaps);
      const prices = parseLines(creatorForm.stagePricesUsd);

      if (caps.length === 0) throw new Error("At least one stage is required.");
      if (caps.length !== prices.length) {
        throw new Error("Stage caps and prices count must match.");
      }
      if (caps.length > 10) throw new Error("Maximum 10 stages allowed.");

      const stageCaps = caps.map((x) => ethers.parseUnits(x, saleDecimals));
      const stagePricesUsd18 = prices.map((x) => ethers.parseUnits(x, 18));

      const totalForSale = stageCaps.reduce((a, b) => a + b, 0n);
      if (totalForSale <= 0n) throw new Error("Total for sale must be > 0.");

      const saleToken = new ethers.Contract(saleTokenAddress, erc20Abi, signer);
      const allowanceRaw = await saleToken.allowance(owner, LAUNCHPAD_ADDRESS);
      const allowance = BigInt(allowanceRaw.toString());

      if (allowance < totalForSale) {
        setCreatorStatus("Approving sale tokens...");
        const approveTx = await saleToken.approve(
          LAUNCHPAD_ADDRESS,
          totalForSale
        );
        await approveTx.wait();
      }

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      setCreatorStatus("Creating launch sale...");

      const tx = await launchpad.createSale(
        saleTokenAddress,
        fundReceiver,
        stageCaps,
        stagePricesUsd18,
        creatorForm.requireKoraxAccess
      );

      const receipt = await tx.wait();

      setCreatorStatus(
        `Launch sale created successfully. Transaction: ${receipt.hash}`
      );
    } catch (err: any) {
      setCreatorStatus(
        err?.shortMessage ||
          err?.reason ||
          err?.message ||
          "Create sale failed."
      );
    } finally {
      setCreatingSale(false);
    }
  }

  async function loadSale() {
    setLoadingSale(true);
    setBuyerStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const saleId = BigInt(buyerForm.saleId || "0");
      const s = await launchpad.sales(saleId);
      const countRaw = await launchpad.stagesCount(saleId);
      const count = Number(countRaw);

      const stages: LoadedStage[] = [];

      for (let i = 0; i < count; i++) {
        const st = await launchpad.getStage(saleId, i);
        stages.push({
          cap: BigInt(st.cap.toString()),
          priceUsd18: BigInt(st.priceUsd18.toString()),
          sold: BigInt(st.sold.toString()),
        });
      }

      const sale: LoadedSale = {
        owner: s.owner,
        saleToken: s.saleToken,
        fundReceiver: s.fundReceiver,
        saleTokenDecimals: Number(s.saleTokenDecimals),
        totalForSale: BigInt(s.totalForSale.toString()),
        totalSold: BigInt(s.totalSold.toString()),
        active: Boolean(s.active),
        claimOpen: Boolean(s.claimOpen),
        requireKoraxAccess: Boolean(s.requireKoraxAccess),
        stages,
      };

      setLoadedSale(sale);

      if (address) {
        const [maxRaw, contributedRaw, purchasedRaw, claimedRaw] =
          await Promise.all([
            launchpad.maxContributionOf(saleId, address),
            launchpad.contributedUsd18(saleId, address),
            launchpad.purchased(saleId, address),
            launchpad.claimed(saleId, address),
          ]);

        setBuyerMax(BigInt(maxRaw.toString()));
        setBuyerContributed(BigInt(contributedRaw.toString()));
        setBuyerPurchased(BigInt(purchasedRaw.toString()));
        setBuyerClaimed(Boolean(claimedRaw));
      } else {
        setBuyerMax(0n);
        setBuyerContributed(0n);
        setBuyerPurchased(0n);
        setBuyerClaimed(false);
      }

      await updatePreview(saleId);
      setBuyerStatus("Sale loaded.");
    } catch (err: any) {
      setLoadedSale(null);
      setBuyerStatus(
        err?.shortMessage ||
          err?.reason ||
          err?.message ||
          "Failed to load sale."
      );
    } finally {
      setLoadingSale(false);
    }
  }

  async function updatePreview(id?: bigint) {
    try {
      if (!LAUNCHPAD_ADDRESS) return;

      const saleId = id ?? BigInt(buyerForm.saleId || "0");
      const amount = ethers.parseUnits(buyerForm.paymentAmount || "0", 18);

      if (amount <= 0n) {
        setPreviewTokens(0n);
        return;
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const out =
        buyerForm.payToken === "USDC"
          ? await launchpad.previewTokensForUSDC(saleId, amount)
          : await launchpad.previewTokensForUSDT(saleId, amount);

      setPreviewTokens(BigInt(out.toString()));
    } catch {
      setPreviewTokens(0n);
    }
  }

  useEffect(() => {
    updatePreview();
  }, [buyerForm.paymentAmount, buyerForm.payToken, buyerForm.saleId]);

  async function buy() {
    setBuying(true);
    setBuyerStatus("");

    try {
      if (!loadedSale) throw new Error("Load sale first.");
      if (!LAUNCHPAD_ADDRESS) throw new Error("Launchpad address is missing.");

      const signer = await getBrowserSigner();
      const buyer = await signer.getAddress();
      const saleId = BigInt(buyerForm.saleId || "0");
      const paymentAmount = ethers.parseUnits(buyerForm.paymentAmount || "0", 18);

      if (paymentAmount <= 0n) throw new Error("Payment amount must be > 0.");

      const paymentAddress =
        buyerForm.payToken === "USDC" ? USDC_ADDRESS : USDT_ADDRESS;

      const paymentToken = new ethers.Contract(paymentAddress, erc20Abi, signer);
      const allowanceRaw = await paymentToken.allowance(buyer, LAUNCHPAD_ADDRESS);
      const allowance = BigInt(allowanceRaw.toString());

      if (allowance < paymentAmount) {
        setBuyerStatus(`Approving ${buyerForm.payToken}...`);
        const approveTx = await paymentToken.approve(
          LAUNCHPAD_ADDRESS,
          paymentAmount
        );
        await approveTx.wait();
      }

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      const tx =
        buyerForm.payToken === "USDC"
          ? await launchpad.buyWithUSDC(saleId, paymentAmount)
          : await launchpad.buyWithUSDT(saleId, paymentAmount);

      const receipt = await tx.wait();

      setBuyerStatus(`Buy successful. Transaction: ${receipt.hash}`);
      await loadSale();
    } catch (err: any) {
      setBuyerStatus(
        err?.shortMessage || err?.reason || err?.message || "Buy failed."
      );
    } finally {
      setBuying(false);
    }
  }

  async function claim() {
    setClaiming(true);
    setBuyerStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) throw new Error("Launchpad address is missing.");

      const signer = await getBrowserSigner();
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      const saleId = BigInt(buyerForm.saleId || "0");
      const tx = await launchpad.claim(saleId);
      const receipt = await tx.wait();

      setBuyerStatus(`Claim successful. Transaction: ${receipt.hash}`);
      await loadSale();
    } catch (err: any) {
      setBuyerStatus(
        err?.shortMessage || err?.reason || err?.message || "Claim failed."
      );
    } finally {
      setClaiming(false);
    }
  }

  async function adminAction(
    action: "approve" | "close" | "claim" | "unsold" | "limits" | "antibot"
  ) {
    setAdminBusy(true);
    setAdminStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) throw new Error("Launchpad address is missing.");

      const signer = await getBrowserSigner();
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      let tx;

      if (action === "approve") {
        if (!adminForm.creatorAddress.trim()) {
          throw new Error("Creator address is required.");
        }

        tx = await launchpad.setSaleCreatorApproval(
          ethers.getAddress(adminForm.creatorAddress.trim()),
          adminForm.approved
        );
      }

      if (action === "close") {
        tx = await launchpad.closeSale(BigInt(adminForm.saleId || "0"));
      }

      if (action === "claim") {
        tx = await launchpad.setClaimOpen(
          BigInt(adminForm.saleId || "0"),
          adminForm.claimOpen
        );
      }

      if (action === "unsold") {
        const to = adminForm.unsoldReceiver.trim()
          ? ethers.getAddress(adminForm.unsoldReceiver.trim())
          : await signer.getAddress();

        tx = await launchpad.withdrawUnsold(BigInt(adminForm.saleId || "0"), to);
      }

      if (action === "limits") {
        tx = await launchpad.setContributionLimits(
          ethers.parseUnits(adminForm.level1Limit || "0", 18),
          ethers.parseUnits(adminForm.level2Limit || "0", 18),
          ethers.parseUnits(adminForm.level3Limit || "0", 18)
        );
      }

      if (action === "antibot") {
        tx = await launchpad.setAntiBot(
          adminForm.antiBotEnabled,
          BigInt(adminForm.cooldown || "0")
        );
      }

      if (!tx) throw new Error("Unknown admin action.");

      const receipt = await tx.wait();
      setAdminStatus(`Admin action successful. Transaction: ${receipt.hash}`);
      await loadSale();
    } catch (err: any) {
      setAdminStatus(
        err?.shortMessage ||
          err?.reason ||
          err?.message ||
          "Admin action failed."
      );
    } finally {
      setAdminBusy(false);
    }
  }

  function levelCard(level: (typeof LEVELS)[number]) {
    const active = access.launchLevel >= level.level;

    return (
      <div
        key={level.name}
        className={[
          "rounded-[28px] border p-6 transition",
          active
            ? "border-[#7CFF6A]/30 bg-[#7CFF6A]/10"
            : "border-white/10 bg-black/25",
        ].join(" ")}
      >
        <div className="text-sm uppercase tracking-[0.25em] text-white/45">
          {level.name}
        </div>

        <div className="mt-2 text-2xl font-extrabold text-white">
          {level.label}
        </div>

        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/45">Requirement</div>
            <div className="mt-1 text-lg font-bold text-white">
              {level.minKrx.toLocaleString("en-US")} KRX
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/45">Max Participation</div>
            <div className="mt-1 text-lg font-bold text-white">
              ${level.maxUsd}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/65">
          {level.desc}
        </p>

        <div className="mt-5 text-sm font-semibold">
          {active ? (
            <span className="text-[#c4ffbc]">Unlocked</span>
          ) : (
            <span className="text-white/45">Locked</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 p-8 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.07),transparent_32%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#c4ffbc]">
              KORAX Launchpad
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
              Launch, join, and claim Web3 projects through KORAX
            </h1>

            <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
              A flexible launch system for AI-created projects and external
              projects. Sales use USDT / USDC, staged pricing, access levels,
              and controlled claim activation.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/35 p-5 text-white/80">
            <div className="text-sm text-white/50">Your Launch Access</div>

            <div className="mt-2 text-2xl font-bold text-white">
              {currentLevel ? currentLevel.label : "Locked"}
            </div>

            <div className="mt-3 grid gap-2 text-sm text-white/60">
              <div>Eligible Staking: {access.eligibleAmount} KRX</div>
              <div>Launch Level: {access.launchLevel}</div>
              <div>Project Slots: {access.totalProjectSlots}</div>
            </div>

            {access.loading ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                Loading access...
              </div>
            ) : !access.connected ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                Connect wallet from the top bar.
              </div>
            ) : access.error ? (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {access.error}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                Wallet: {shortAddress(access.wallet)}
              </div>
            )}
          </div>
        </div>
      </section>

      {loadedBuilderProject ? (
        <section className="rounded-[30px] border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#c4ffbc]">
                Project Loaded from KORAX Builder
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                {loadedBuilderProject.projectName || "Loaded Project"}
                {loadedBuilderProject.symbol ? (
                  <span className="text-[#c4ffbc]">
                    {" "}
                    ({loadedBuilderProject.symbol})
                  </span>
                ) : null}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
                {loadedBuilderProject.shortDescription ||
                  loadedBuilderProject.websiteSummary ||
                  "This project was loaded from the KORAX builder flow and is ready for launch setup."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white/75">
              Website:{" "}
              <span className="text-[#c4ffbc]">
                {loadedBuilderProject.websiteGenerated
                  ? "Generated"
                  : "Not generated"}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs text-white/45">Token Contract</div>
              <div className="mt-2 break-all text-sm font-semibold text-white">
                {loadedBuilderProject.tokenAddress || "Not available"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs text-white/45">Vault Contract</div>
              <div className="mt-2 break-all text-sm font-semibold text-white">
                {loadedBuilderProject.vaultAddress || "Not available"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs text-white/45">Staking Contract</div>
              <div className="mt-2 break-all text-sm font-semibold text-white">
                {loadedBuilderProject.stakingAddress ||
                  "Not deployed / disabled"}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/70">
            Next step: configure the launch sale stages, prices, fund receiver,
            and KORAX access requirement. The sale token field has been filled
            automatically from the deployed project token.
          </div>
        </section>
      ) : null}

      <section className="rounded-[30px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Launch Access Levels</h2>

        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Participation limits are based on KRX staking access.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {LEVELS.map(levelCard)}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[30px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">Join Launch</h2>

          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Load a sale by ID, buy with USDT or USDC, then claim after the sale
            closes and claim opens.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <input
                value={buyerForm.saleId}
                onChange={(e) =>
                  setBuyerForm((prev) => ({ ...prev, saleId: e.target.value }))
                }
                placeholder="Sale ID"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <button
                type="button"
                onClick={loadSale}
                disabled={loadingSale}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                {loadingSale ? "Loading..." : "Load Sale"}
              </button>
            </div>

            {loadedSale ? (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="grid gap-3 text-sm text-white/75">
                  <div>
                    <span className="text-white/45">Owner:</span>{" "}
                    {shortAddress(loadedSale.owner)}
                  </div>

                  <div>
                    <span className="text-white/45">Sale Token:</span>{" "}
                    {shortAddress(loadedSale.saleToken)}
                  </div>

                  <div>
                    <span className="text-white/45">Fund Receiver:</span>{" "}
                    {shortAddress(loadedSale.fundReceiver)}
                  </div>

                  <div>
                    <span className="text-white/45">Status:</span>{" "}
                    {loadedSale.active ? "Active" : "Closed"} / Claim{" "}
                    {loadedSale.claimOpen ? "Open" : "Closed"}
                  </div>

                  <div>
                    <span className="text-white/45">Sold:</span>{" "}
                    {formatUnitsSafe(
                      loadedSale.totalSold,
                      loadedSale.saleTokenDecimals
                    )}{" "}
                    /{" "}
                    {formatUnitsSafe(
                      loadedSale.totalForSale,
                      loadedSale.saleTokenDecimals
                    )}
                  </div>

                  <div>
                    <span className="text-white/45">Your Max:</span> $
                    {formatUnitsSafe(buyerMax, 18, 2)}
                  </div>

                  <div>
                    <span className="text-white/45">Your Contributed:</span> $
                    {formatUnitsSafe(buyerContributed, 18, 2)}
                  </div>

                  <div>
                    <span className="text-white/45">Your Purchased:</span>{" "}
                    {formatUnitsSafe(
                      buyerPurchased,
                      loadedSale.saleTokenDecimals
                    )}
                  </div>

                  <div>
                    <span className="text-white/45">Claimed:</span>{" "}
                    {buyerClaimed ? "Yes" : "No"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="font-semibold text-white">Stages</div>
                  {loadedSale.stages.map((st, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/70"
                    >
                      <div className="font-semibold text-white">
                        Stage {idx + 1}
                      </div>
                      <div className="mt-1">
                        Price: ${formatUnitsSafe(st.priceUsd18, 18, 6)}
                      </div>
                      <div className="mt-1">
                        Sold:{" "}
                        {formatUnitsSafe(st.sold, loadedSale.saleTokenDecimals)} /{" "}
                        {formatUnitsSafe(st.cap, loadedSale.saleTokenDecimals)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <input
                value={buyerForm.paymentAmount}
                onChange={(e) =>
                  setBuyerForm((prev) => ({
                    ...prev,
                    paymentAmount: e.target.value,
                  }))
                }
                placeholder="Payment Amount"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <select
                value={buyerForm.payToken}
                onChange={(e) =>
                  setBuyerForm((prev) => ({
                    ...prev,
                    payToken: e.target.value,
                  }))
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Estimated tokens:{" "}
              <span className="font-semibold text-white">
                {loadedSale
                  ? formatUnitsSafe(previewTokens, loadedSale.saleTokenDecimals)
                  : "0"}
              </span>
            </div>

            <button
              type="button"
              onClick={buy}
              disabled={buying || !loadedSale || !loadedSale.active}
              className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {buying ? "Buying..." : "Buy"}
            </button>

            {buyerStatus ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {buyerStatus}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">
            Claim Purchased Tokens
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-white/70">
            After the project owner closes the sale and opens claim, buyers can
            withdraw their purchased tokens here.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={buyerForm.saleId}
              onChange={(e) =>
                setBuyerForm((prev) => ({ ...prev, saleId: e.target.value }))
              }
              placeholder="Sale ID"
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />

            <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-sm text-white/70">
              <div>
                Purchased:{" "}
                <span className="font-semibold text-white">
                  {loadedSale
                    ? formatUnitsSafe(
                        buyerPurchased,
                        loadedSale.saleTokenDecimals
                      )
                    : "0"}
                </span>
              </div>

              <div className="mt-2">
                Claim status:{" "}
                <span className="font-semibold text-white">
                  {loadedSale?.claimOpen ? "Open" : "Closed"}
                </span>
              </div>

              <div className="mt-2">
                Already claimed:{" "}
                <span className="font-semibold text-white">
                  {buyerClaimed ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadSale}
                disabled={loadingSale}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                Refresh Sale
              </button>

              <button
                type="button"
                onClick={claim}
                disabled={claiming || !loadedSale || !loadedSale.claimOpen}
                className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
              >
                {claiming ? "Claiming..." : "Claim Tokens"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {canCreateSale ? (
        <section className="rounded-[30px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">Create Launch Sale</h2>

          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Visible only for Launchpad owner or approved sale creators.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={creatorForm.saleToken}
              onChange={(e) =>
                setCreatorForm((prev) => ({
                  ...prev,
                  saleToken: e.target.value,
                }))
              }
              placeholder="Sale Token Address"
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />

            <input
              value={creatorForm.fundReceiver}
              onChange={(e) =>
                setCreatorForm((prev) => ({
                  ...prev,
                  fundReceiver: e.target.value,
                }))
              }
              placeholder="Fund Receiver Wallet / leave empty for your wallet"
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <textarea
                value={creatorForm.stageCaps}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    stageCaps: e.target.value,
                  }))
                }
                rows={5}
                placeholder={"Stage caps\n1000000\n1000000\n1000000"}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <textarea
                value={creatorForm.stagePricesUsd}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    stagePricesUsd: e.target.value,
                  }))
                }
                rows={5}
                placeholder={"Stage prices USD\n0.01\n0.015\n0.02"}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={creatorForm.requireKoraxAccess}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    requireKoraxAccess: e.target.checked,
                  }))
                }
              />
              Require KORAX launch access to participate
            </label>

            <button
              type="button"
              onClick={createSale}
              disabled={creatingSale}
              className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {creatingSale ? "Creating Sale..." : "Create Launch Sale"}
            </button>

            {creatorStatus ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {creatorStatus}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {isLaunchpadOwner ? (
        <section className="rounded-[30px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">
            Admin / Launch Manager
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Visible only for Launchpad owner.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={adminForm.saleId}
              onChange={(e) =>
                setAdminForm((prev) => ({ ...prev, saleId: e.target.value }))
              }
              placeholder="Sale ID"
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />

            <div className="grid gap-4 md:grid-cols-[1fr_130px]">
              <input
                value={adminForm.creatorAddress}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    creatorAddress: e.target.value,
                  }))
                }
                placeholder="Creator address"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <select
                value={adminForm.approved ? "true" : "false"}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    approved: e.target.value === "true",
                  }))
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              >
                <option value="true">Approve</option>
                <option value="false">Remove</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => adminAction("approve")}
              disabled={adminBusy}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Set Creator Approval
            </button>

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => adminAction("close")}
                disabled={adminBusy}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-semibold text-red-100 disabled:opacity-50"
              >
                Close Sale
              </button>

              <button
                type="button"
                onClick={() => adminAction("claim")}
                disabled={adminBusy}
                className="rounded-xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-5 py-3 font-semibold text-[#c4ffbc] disabled:opacity-50"
              >
                {adminForm.claimOpen ? "Open Claim" : "Close Claim"}
              </button>

              <select
                value={adminForm.claimOpen ? "true" : "false"}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    claimOpen: e.target.value === "true",
                  }))
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              >
                <option value="true">Claim Open</option>
                <option value="false">Claim Closed</option>
              </select>
            </div>

            <input
              value={adminForm.unsoldReceiver}
              onChange={(e) =>
                setAdminForm((prev) => ({
                  ...prev,
                  unsoldReceiver: e.target.value,
                }))
              }
              placeholder="Unsold receiver / leave empty for your wallet"
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />

            <button
              type="button"
              onClick={() => adminAction("unsold")}
              disabled={adminBusy}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Withdraw Unsold Tokens
            </button>

            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={adminForm.level1Limit}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    level1Limit: e.target.value,
                  }))
                }
                placeholder="Level 1 USD"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <input
                value={adminForm.level2Limit}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    level2Limit: e.target.value,
                  }))
                }
                placeholder="Level 2 USD"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <input
                value={adminForm.level3Limit}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    level3Limit: e.target.value,
                  }))
                }
                placeholder="Level 3 USD"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => adminAction("limits")}
              disabled={adminBusy}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Update Contribution Limits
            </button>

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <select
                value={adminForm.antiBotEnabled ? "true" : "false"}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    antiBotEnabled: e.target.value === "true",
                  }))
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              >
                <option value="true">Anti-Bot On</option>
                <option value="false">Anti-Bot Off</option>
              </select>

              <input
                value={adminForm.cooldown}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    cooldown: e.target.value,
                  }))
                }
                placeholder="Cooldown"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => adminAction("antibot")}
              disabled={adminBusy}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Update Anti-Bot
            </button>

            {adminStatus ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {adminStatus}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}