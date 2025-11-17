"use client";
import {
  FundMasterChef,
  IssueRewards,
  TransferStakeToken,
  TransferTokenFarm,
} from "@/components";

export default function DashboardDefiPage() {
  return (
    <>
      <IssueRewards />
      <TransferTokenFarm />
      <FundMasterChef />
    </>
  );
}
