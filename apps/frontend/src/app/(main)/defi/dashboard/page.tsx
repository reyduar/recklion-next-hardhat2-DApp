"use client";
import { FundMasterChef, IssueRewards, TransferTokenFarm } from "@/components";

export default function DashboardDefiPage() {
  return (
    <>
      <IssueRewards />
      <TransferTokenFarm />
      <FundMasterChef />
    </>
  );
}
