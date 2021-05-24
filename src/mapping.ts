import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer
} from "../generated/GRT/GRT"
import { User } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  let userTo = User.load(event.params.to.toHexString())
  let userFrom = User.load(event.params.from.toHexString())

  if(userTo == null) {
    userTo = new User(event.params.to.toHexString())
    userTo.balance = BigInt.fromI32(0)
  }

  if(userFrom == null) {
    userFrom = new User(event.params.from.toHexString())
    userFrom.balance = BigInt.fromI32(0)
  }

  userTo.balance = userTo.balance.plus(event.params.value)
  userFrom.balance = userFrom.balance.minus(event.params.value)

  userTo.save()
  userFrom.save()

  if(event.block.number.toI32() >= 11456769) {
    abort("fail subgraph on purpose")
  }
}
