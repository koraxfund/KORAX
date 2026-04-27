"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import {
  ACCESS_MANAGER_ADDRESS,
  LAUNCHPAD_ADDRESS,
  RPC_URL,
  accessManagerAbi,
  launchpadAbi,
  erc20Abi,
} from "@/lib/korax/contracts";

const NATIVE_BNB = ethers.ZeroAddress;

const LEVELS = [
  {
    name: "Level 1",
    label: "Basic Access",
    minKrx: 500,
    level: 1,
    desc: "Entry access for KORAX launch participation.",
  },
  {
    name: "Level 2",
    label: "Strong Access",
    minKrx: 2500,
    level: 2,
    desc: "Higher allocation power for committed KRX holders.",
  },
  {
    name: "Level 3",
    label: "Priority Access",
    minKrx: 5000,
    level: 3,
    desc: "Priority participation power with the highest launch allocation.",
  },
];

type AccessState = {
  loading: boolean;
  connected: boolean;
  wallet: string;
  eligibleAmount: string;
  eligibleNumber: number;
  launchLevel: number;
  totalProjectSlots: number;
  hasLaunchAccess: boolean;
  level1Amount: string;
  level2Amount: string;
  level3Amount: string;
  requiredRewardBps: number;
  error: string;
};

type LoadedSale = {
  owner: string;
  saleToken: string;
  paymentToken: string;
  saleTokenDecimals: number;
  totalForSale: bigint;
  pricePerToken: bigint;
  hardCap: bigint;
  baseMaxContribution: bigint;
  contributionPerLevel: bigint;
  raised: bigint;
  sold: bigint;
  active: boolean;
  claimOpen: boolean;
  requireKoraxAccess: boolean;
};

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUnitsSafe(value: bigint, decimals = 18) {
  try {
    return Number(ethers.formatUnits(value, decimals)).toLocaleString("en-US", {
      maximumFractionDigits: 6,
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

function paymentLabel(paymentToken: string) {
  return paymentToken === NATIVE_BNB ? "BNB" : shortAddress(paymentToken);
}

export default function LaunchPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [access, setAccess] = useState<AccessState>({
    loading: false,
    connected: false,
    wallet: "",
    eligibleAmount: "0",
    eligibleNumber: 0,
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

  const [creatorForm, setCreatorForm] = useState({
    saleToken: "",
    paymentToken: NATIVE_BNB,
    totalForSale: "10000000",
    pricePerToken: "0.01",
    hardCap: "100",
    baseMaxContribution: "0.1",
    contributionPerLevel: "0.05",
    requireKoraxAccess: true,
  });

  const [creatorStatus, setCreatorStatus] = useState("");
  const [creatingSale, setCreatingSale] = useState(false);

  const [buyerForm, setBuyerForm] = useState({
    saleId: "0",
    paymentAmount: "0.1",
  });

  const [loadedSale, setLoadedSale] = useState<LoadedSale | null>(null);
  const [buyerMax, setBuyerMax] = useState<bigint>(0n);
  const [buyerPurchased, setBuyerPurchased] = useState<bigint>(0n);
  const [buyerContributed, setBuyerContributed] = useState<bigint>(0n);
  const [buyerClaimed, setBuyerClaimed] = useState(false);
  const [buyerStatus, setBuyerStatus] = useState("");
  const [loadingSale, setLoadingSale] = useState(false);
  const [buying, setBuying] = useState(false);
  const [claiming, setClaiming] = useState(false);

  async function getPaymentDecimals(paymentToken: string) {
    if (paymentToken === NATIVE_BNB) return 18;

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const token = new ethers.Contract(paymentToken, erc20Abi, provider);
    const decimals = await token.decimals();

    return Number(decimals);
  }

  async function getSaleTokenDecimals(saleToken: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const token = new ethers.Contract(saleToken, erc20Abi, provider);
    const decimals = await token.decimals();

    return Number(decimals);
  }

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

  async function loadAccess(user?: string) {
    if (!user) {
      setAccess({
        loading: false,
        connected: false,
        wallet: "",
        eligibleAmount: "0",
        eligibleNumber: 0,
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
      const eligibleFormatted = Number(ethers.formatUnits(eligibleBig, 18));

      const level1Big = BigInt(launchData.level1Amount.toString());
      const level2Big = BigInt(launchData.level2Amount.toString());
      const level3Big = BigInt(launchData.level3Amount.toString());

      setAccess({
        loading: false,
        connected: true,
        wallet: user,
        eligibleAmount: eligibleFormatted.toLocaleString("en-US", {
          maximumFractionDigits: 4,
        }),
        eligibleNumber: eligibleFormatted,
        launchLevel: Number(launchData.launchLevel),
        totalProjectSlots: Number(accessData.totalProjectSlots),
        hasLaunchAccess: Boolean(hasLaunchAccessRaw),
        level1Amount: Number(ethers.formatUnits(level1Big, 18)).toLocaleString(
          "en-US",
          { maximumFractionDigits: 0 }
        ),
        level2Amount: Number(ethers.formatUnits(level2Big, 18)).toLocaleString(
          "en-US",
          { maximumFractionDigits: 0 }
        ),
        level3Amount: Number(ethers.formatUnits(level3Big, 18)).toLocaleString(
          "en-US",
          { maximumFractionDigits: 0 }
        ),
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
      return;
    }

    loadAccess(address);
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

      const paymentTokenAddress =
        creatorForm.paymentToken === NATIVE_BNB
          ? NATIVE_BNB
          : ethers.getAddress(creatorForm.paymentToken.trim());

      const saleDecimals = await getSaleTokenDecimals(saleTokenAddress);
      const paymentDecimals = await getPaymentDecimals(paymentTokenAddress);

      const totalForSale = ethers.parseUnits(
        creatorForm.totalForSale || "0",
        saleDecimals
      );

      const pricePerToken = ethers.parseUnits(
        creatorForm.pricePerToken || "0",
        paymentDecimals
      );

      const hardCap = ethers.parseUnits(
        creatorForm.hardCap || "0",
        paymentDecimals
      );

      const baseMaxContribution = ethers.parseUnits(
        creatorForm.baseMaxContribution || "0",
        paymentDecimals
      );

      const contributionPerLevel = ethers.parseUnits(
        creatorForm.contributionPerLevel || "0",
        paymentDecimals
      );

      if (totalForSale <= 0n) throw new Error("Total for sale must be > 0.");
      if (pricePerToken <= 0n) throw new Error("Price must be > 0.");
      if (hardCap <= 0n) throw new Error("Hard cap must be > 0.");
      if (baseMaxContribution <= 0n) {
        throw new Error("Base max contribution must be > 0.");
      }

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
        paymentTokenAddress,
        totalForSale,
        pricePerToken,
        hardCap,
        baseMaxContribution,
        contributionPerLevel,
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

      const id = BigInt(buyerForm.saleId || "0");
      const s = await launchpad.sales(id);

      const sale: LoadedSale = {
        owner: s.owner,
        saleToken: s.saleToken,
        paymentToken: s.paymentToken,
        saleTokenDecimals: Number(s.saleTokenDecimals),
        totalForSale: BigInt(s.totalForSale.toString()),
        pricePerToken: BigInt(s.pricePerToken.toString()),
        hardCap: BigInt(s.hardCap.toString()),
        baseMaxContribution: BigInt(s.baseMaxContribution.toString()),
        contributionPerLevel: BigInt(s.contributionPerLevel.toString()),
        raised: BigInt(s.raised.toString()),
        sold: BigInt(s.sold.toString()),
        active: Boolean(s.active),
        claimOpen: Boolean(s.claimOpen),
        requireKoraxAccess: Boolean(s.requireKoraxAccess),
      };

      setLoadedSale(sale);

      if (address) {
        const [maxRaw, contributedRaw, purchasedRaw, claimedRaw] =
          await Promise.all([
            launchpad.maxContributionOf(id, address),
            launchpad.contributed(id, address),
            launchpad.purchased(id, address),
            launchpad.claimed(id, address),
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

  async function buy() {
    setBuying(true);
    setBuyerStatus("");

    try {
      if (!loadedSale) {
        throw new Error("Load sale first.");
      }

      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

      const signer = await getBrowserSigner();
      const buyer = await signer.getAddress();

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      const saleId = BigInt(buyerForm.saleId || "0");
      const paymentDecimals = await getPaymentDecimals(loadedSale.paymentToken);

      const paymentAmount = ethers.parseUnits(
        buyerForm.paymentAmount || "0",
        paymentDecimals
      );

      if (paymentAmount <= 0n) {
        throw new Error("Payment amount must be > 0.");
      }

      if (loadedSale.paymentToken === NATIVE_BNB) {
        const tx = await launchpad.buyWithBNB(saleId, {
          value: paymentAmount,
        });
        const receipt = await tx.wait();

        setBuyerStatus(`Buy successful. Transaction: ${receipt.hash}`);
      } else {
        const paymentToken = new ethers.Contract(
          loadedSale.paymentToken,
          erc20Abi,
          signer
        );

        const allowanceRaw = await paymentToken.allowance(
          buyer,
          LAUNCHPAD_ADDRESS
        );
        const allowance = BigInt(allowanceRaw.toString());

        if (allowance < paymentAmount) {
          setBuyerStatus("Approving payment token...");
          const approveTx = await paymentToken.approve(
            LAUNCHPAD_ADDRESS,
            paymentAmount
          );
          await approveTx.wait();
        }

        const tx = await launchpad.buyWithToken(saleId, paymentAmount);
        const receipt = await tx.wait();

        setBuyerStatus(`Buy successful. Transaction: ${receipt.hash}`);
      }

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
      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

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

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="text-xs text-white/45">Requirement</div>
          <div className="mt-1 text-lg font-bold text-white">
            {level.minKrx.toLocaleString("en-US")} KRX
          </div>
          <div className="mt-1 text-sm text-white/55">Staked on required plan</div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="text-xs text-white/45">Launch Level</div>
          <div className="mt-1 text-lg font-bold text-white">{level.level}</div>
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
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              KORAX Launchpad
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Launch and join projects through KORAX
            </h1>

            <p className="mt-3 max-w-3xl leading-relaxed text-white/70">
              KORAX Launchpad supports internal AI-created projects and external
              projects. Participation can be gated by KRX staking access, giving
              committed KRX holders stronger allocation power.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80">
            <div className="text-sm text-white/50">Your Launch Access</div>

            <div className="mt-2 text-2xl font-bold text-white">
              {currentLevel ? currentLevel.label : "Locked"}
            </div>

            <div className="mt-2 text-sm text-white/60">
              Eligible Staking: {access.eligibleAmount} KRX
            </div>

            <div className="mt-2 text-sm text-white/60">
              Launch Level: {access.launchLevel}
            </div>

            <div className="mt-2 text-sm text-white/60">
              Project Slots: {access.totalProjectSlots}
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

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Launch Access Levels</h2>

        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Three participation levels based on KRX staking through the required
          staking plan. Launches that require KORAX access can only be joined by
          wallets with at least Level 1.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {LEVELS.map(levelCard)}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">Create Launch Sale</h2>

          <p className="mt-2 text-sm leading-relaxed text-white/60">
            For approved project creators. The creator must approve and deposit
            sale tokens into the Launchpad contract during sale creation.
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
              value={creatorForm.paymentToken}
              onChange={(e) =>
                setCreatorForm((prev) => ({
                  ...prev,
                  paymentToken: e.target.value || NATIVE_BNB,
                }))
              }
              placeholder="Payment Token Address, or 0x000...000 for BNB"
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={creatorForm.totalForSale}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    totalForSale: e.target.value,
                  }))
                }
                placeholder="Total Tokens For Sale"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <input
                value={creatorForm.pricePerToken}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    pricePerToken: e.target.value,
                  }))
                }
                placeholder="Price Per Token"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <input
                value={creatorForm.hardCap}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    hardCap: e.target.value,
                  }))
                }
                placeholder="Hard Cap"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <input
                value={creatorForm.baseMaxContribution}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    baseMaxContribution: e.target.value,
                  }))
                }
                placeholder="Base Max Contribution"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              />

              <input
                value={creatorForm.contributionPerLevel}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    contributionPerLevel: e.target.value,
                  }))
                }
                placeholder="Contribution Bonus Per Level"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none md:col-span-2"
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
              Require KORAX access to participate
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
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">Join Launch</h2>

          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Load a sale by ID, check your allocation, buy with BNB or supported
            tokens, then claim after the sale is closed and claim is opened.
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
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
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
                    <span className="text-white/45">Payment:</span>{" "}
                    {paymentLabel(loadedSale.paymentToken)}
                  </div>

                  <div>
                    <span className="text-white/45">Status:</span>{" "}
                    {loadedSale.active ? "Active" : "Closed"} / Claim{" "}
                    {loadedSale.claimOpen ? "Open" : "Closed"}
                  </div>

                  <div>
                    <span className="text-white/45">Sold:</span>{" "}
                    {formatUnitsSafe(
                      loadedSale.sold,
                      loadedSale.saleTokenDecimals
                    )}{" "}
                    /{" "}
                    {formatUnitsSafe(
                      loadedSale.totalForSale,
                      loadedSale.saleTokenDecimals
                    )}
                  </div>

                  <div>
                    <span className="text-white/45">Your Max Contribution:</span>{" "}
                    {formatUnitsSafe(buyerMax, 18)}
                  </div>

                  <div>
                    <span className="text-white/45">Your Contributed:</span>{" "}
                    {formatUnitsSafe(buyerContributed, 18)}
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
              </div>
            ) : null}

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

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={buy}
                disabled={buying || !loadedSale || !loadedSale.active}
                className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
              >
                {buying ? "Buying..." : "Buy"}
              </button>

              <button
                type="button"
                onClick={claim}
                disabled={claiming || !loadedSale || !loadedSale.claimOpen}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                {claiming ? "Claiming..." : "Claim"}
              </button>
            </div>

            {buyerStatus ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {buyerStatus}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}