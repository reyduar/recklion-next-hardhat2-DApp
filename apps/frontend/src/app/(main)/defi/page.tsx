"use client";
import {
  FundMasterChef,
  IssueRewards,
  TransferStakeToken,
  TransferTokenFarm,
} from "@/components";
import { Button } from "@heroui/react";
import { redirect } from "next/navigation";
import { PiWalletBold } from "react-icons/pi";

export default function DefiPage() {
  return (
    <>
      <Button
        startContent={<PiWalletBold size={24} />}
        onPress={() => redirect("/")}
        color="primary"
      >
        Wallet
      </Button>
      <h1 className="text-3xl font-bold mb-6"> DeFi</h1>
      <TransferStakeToken />
      <h1 className="text-3xl font-bold mb-6"> Owner Dashboard</h1>
      <IssueRewards />
      <TransferTokenFarm />
      <FundMasterChef />
    </>
  );
}
