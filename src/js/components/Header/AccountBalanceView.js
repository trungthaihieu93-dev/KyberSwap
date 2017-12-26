import React from "react"
import * as converts from "../../utils/converter"

const AccountBalanceView = (props) => {

  function getBalances() {
    var balances = Object.values(props.tokens).map(token => {
      var balance = converts.toT(token.balance, token.decimal)
      return (
        <div className="columns my-2" key={token.symbol}>
          <div className={'balance-item ' + (token.symbol == 'ETH' ? 'active' : '')}>
            <img src={require("../../../assets/img/tokens/" + token.icon)} />
            <div className="d-inline-block">
              <div className="symbol font-w-b">{token.symbol}</div>
              <div title={balance} className="balance">{converts.roundingNumber(balance)}</div>
            </div>
          </div>
        </div>
      )
    })
    return balances
  }

  var total = 0
  Object.values(props.tokens).map(token => {
    var balance = converts.toT(token.balance, token.decimal)
    total += balance * token.rateUSD
  })

  var roundingTotal = converts.roundingNumber(total)
  return (
    <div>
      <div className="row balance-header">
        <div className="column">
          <div className="mt-3 clearfix">
            <h4 className="title font-w-b float-left">My balance</h4>
            <p title={total} className="float-right font-w-b">
              <span className="text-success text-uppercase">Total</span>
              <span className="font-s-up-1 ml-2">{roundingTotal}</span> USD
            </p>
          </div>
        </div>
      </div>
      <div className="balances">
        <div className={'row small-up-1 medium-up-3 large-up-5 ' + (props.expanded ? 'active' : '')}>
          {getBalances()}
        </div>
        <div className="expand">
          <div className="row align-right">
            <div className="text-right">
              <button onClick={props.toggleBalances}>^</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountBalanceView