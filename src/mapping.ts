import { BigInt } from "@graphprotocol/graph-ts"
import {
  AddedToWhitelist,
  LoanCreated,
  LoanIncreased,
  RemovedFromWhitelist,
  Repayment
} from "../generated/Contract/Contract"
import * as Schema from "../generated/schema"

export function handleAddedToWhitelist(event: AddedToWhitelist): void {
  let whitelist = Schema.Whitelist.load(event.address.toHexString().toLowerCase())
  if (!whitelist) {
    whitelist = new Schema.Whitelist(event.address.toHexString().toLowerCase())
  }
  whitelist.members.push(event.params.account)
  whitelist.save()
}
export function handleRemovedFromWhitelist(event: RemovedFromWhitelist): void {
  let whitelist = new Schema.Whitelist(event.address.toHexString().toLowerCase())
  whitelist.members.filter((member) => {
    return member !== event.params.account
  })
  whitelist.save()
}
export function handleLoanCreated(event: LoanCreated): void {
  let loan = new Schema.Loan(event.params.id.toI32())
  loan.agreements = event.params.agreements
  loan.save()
}

export function handleLoanIncreased(event: LoanIncreased): void {
  let loanIncreased = new Schema.LoanIncreased(event.transaction.hash.toHex())
  loanIncreased.amount = event.params.amount.toI32()
  let loan = Schema.Loan.load(event.address.toHexString().toLowerCase())
  if (loan) {
    loan.loanIncreasings.push(loanIncreased.id)
    loan.save()
  }
  loanIncreased.save()
}

export function handleRepayment(event: Repayment): void {
  let repayment = new Schema.Repayment(event.transaction.hash.toHex())
  repayment.amount = event.params.amount
  repayment.agreement = event.params.agreement
  let loan = Schema.Loan.load(event.address.toHexString().toLowerCase())
  if (loan) {
    loan.loanIncreasings.push(repayment.id)
    loan.save()
  }
  repayment.save()
}




