import React from "react"
import { connect } from "react-redux"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import * as exchangeActions from "../../actions/exchangeActions"
import * as analytics from "../../utils/analytics"
import * as converters from "../../utils/converter"

@connect((store, props) => {
    return {
        exchange: store.exchange,
        tokens: store.tokens.tokens,
        ethereum: store.connection.ethereum,
        changeAmount: props.changeAmount,
        changeFocus: props.changeFocus,
        typeTx: props.typeTx,
        transfer: store.transfer
    }
})

export default class ChooseBalanceModal extends React.Component {
    constructor(){
        super()
        this.state = {
            open: false
        }
    }
    showChooseBalance = () => {
        this.setState({open: true})
    }
    hideChooseBalance = () => {
        this.setState({open: false})
    }

    selectBalance = (percent) => {
        var sourceSymbol = this.props.sourceTokenSymbol
        var sourceBalance = this.props.tokens[sourceSymbol].balance
        var sourceDecimal = this.props.tokens[sourceSymbol].decimals
        var amount

        if (!sourceBalance) {
          this.hideChooseBalance();
          return;
        }

        if (sourceSymbol !== "ETH"){
            amount = sourceBalance * percent / 100
        } else {
            var gasLimit, totalGas
            if (this.props.typeTx === "swap") {
                gasLimit = this.props.exchange.max_gas
                totalGas = converters.calculateGasFee(this.props.exchange.gasPrice, gasLimit) * Math.pow(10,18)
                // amount = (sourceBalance - totalGas) * percent / 100
            } else {
                gasLimit = this.props.transfer.gas
                totalGas = converters.calculateGasFee(this.props.transfer.gasPrice, gasLimit) * Math.pow(10,18)
                // amount = (sourceBalance - totalGas) * percent / 100
            }
            var amount = (sourceBalance - totalGas) * percent / 100
        }

        amount = amount / Math.pow(10,sourceDecimal)

        if (this.props.typeTx === "swap") {
            this.props.dispatch(this.props.changeAmount('source', converters.roundingNumber(amount).toString(10)))
            this.props.dispatch(this.props.changeFocus('source'));
            if (this.props.typeTx === "swap") this.props.ethereum.fetchRateExchange(true)
        } else {
            this.props.dispatch(this.props.changeAmount(converters.roundingNumber(amount).toString(10)))
            this.props.changeFocus()
        }
        this.hideChooseBalance()
        analytics.trackClickChooseBalance(percent)
        // this.setState({percent: percent})
    }

    // isThisPercent = (percent) => {
    //     if (this.state.percent === percent) {
    //         return "checked"
    //     }
    //     return ""
    // }

    render = () => {
        return (
            <div class="swap-balance-modal">
                <Dropdown onShow={(e) => this.showChooseBalance(e)} onHide={(e) => this.hideChooseBalance(e)} active={this.state.open}>
                    <DropdownTrigger className="notifications-toggle">
                        <div className="exchange-content__label exchange-content__label--dropdown">
                            <div className={"token-symbol"}>{this.props.sourceTokenSymbol}</div>
                        </div>
                    </DropdownTrigger>
                    <DropdownContent>
                    <div className="select-item">
                        <div className="list-item custom-scroll">
                            <div onClick={(e) => this.selectBalance(25)}>Swap 25% balance</div>
                            <div onClick={(e) => this.selectBalance(50)}>Swap 50% balance</div>
                            <div onClick={(e) => this.selectBalance(100)}>Swap 100% balance</div>
                        </div>
                        </div>
                    </DropdownContent>
                </Dropdown>
            </div>
        )
    }
}
